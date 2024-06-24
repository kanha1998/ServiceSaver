const schedule = require('node-schedule');
const axios = require('axios');
const Service = require('../models/serviceModel');
const Environment = require('../models/develop/environment');
const Alert = require('../models/develop/alertModel');
const emailService = require('./sendReportEmail');
const emailPollingService = require('./emailPollingService');
const alertService = require('./alertService');
const { Op } = require('sequelize');

// Helper function to check service health
const checkService = async (service) => {
  try {
    const response = await axios.get(service.url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const getStartOfToday = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

// Perform health check on all services
const performHealthCheck = async () => {
  try {
    const services = await Service.findAll({
      include: {
        model: Environment,
        attributes: ['environment_name','environment_id']
      }
    });
    const startOfToday = getStartOfToday();

    for (const service of services) {
      const isHealthy = await checkService(service);
      const now = new Date();

      if (!isHealthy) {
        const lastAlert = service.last_alert || new Date(0);
        const alertIntervalPassed = now - lastAlert > 15 * 60 * 1000; // 15 minutes interval

        if (!service.is_acknowledged && alertIntervalPassed) {
          service.last_alert = now;
          service.alert_count = (service.alert_count || 0) + 1;
          service.health_status = 'RED';
          service.updated_by = 'SYSTEM_BOT'
          service.updated_at = now;
          await alertService.sendAlert(service);
          await service.save(); // Save changes to service

          // Check if an alert for this service exists today
          const existingAlert = await Alert.findOne({
            where: {
              service_id: service.id,
              created_at: {
                [Op.gte]: startOfToday
              }
            }
          });

          if (existingAlert) {
            // Update the existing alert
            await existingAlert.update({
              status: 'TRIGGERED',
              acknowledged_by: null,
              environment_id: service.Environment.environment_id,
              updated_by: "SYSTEM_BOT"
            });
          } else {
            // Create a new alert
            await Alert.create({
              service_id: service.id,
              status: 'TRIGGERED',
              environment_id: service.Environment.environment_id,
              created_by: "SYSTEM_BOT"
            });
          }
        }
      } else {
        // Reset service status if healthy
        service.alert_count = 0;
        service.is_acknowledged = false;
        service.assigned_to = null;
        service.health_status = 'GREEN';
        service.updated_by = 'SYSTEM_BOT'
        service.updated_at = now;
        await service.save(); 
      }
    }
  } catch (error) {
    console.error('Error performing health check', error);
  }
};
// Schedule health checks and email reports
const scheduleHealthChecks = () => {
  schedule.scheduleJob('*/20 * * * * *', performHealthCheck); // Run every 20 seconds
  // emailPollingService.scheduleEmailPolling();
  // schedule.scheduleJob('0 */6 * * *', emailService.sendReportEmail); // Run every 6 hours
};


module.exports = { performHealthCheck, scheduleHealthChecks };
