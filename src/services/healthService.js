const schedule = require('node-schedule');
const axios = require('axios');
const Service = require('../models/serviceModel');
const Alert = require('../models/alertModel');
const emailService = require('./emailService');
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
    const services = await Service.findAll(); // Retrieve all services
    const startOfToday = getStartOfToday();

    for (const service of services) {
      const isHealthy = await checkService(service);
      const now = new Date();

      if (!isHealthy) {
        const lastAlert = service.lastAlert || new Date(0);
        const alertIntervalPassed = now - lastAlert > 15 * 60 * 1000; // 15 minutes interval

        if (!service.isAcknowledged && alertIntervalPassed) {
          await alertService.sendAlert(service);
          service.lastAlert = now;
          service.alertCount = (service.alertCount || 0) + 1;
          await service.save(); // Save changes to service

          // Check if an alert for this service exists today
          const existingAlert = await Alert.findOne({
            where: {
              serviceId: service.id,
              createdAt: {
                [Op.gte]: startOfToday
              }
            }
          });

          if (existingAlert) {
            // Update the existing alert
            await existingAlert.update({
              status: 'triggered',
              acknowledgedBy: null
            });
          } else {
            // Create a new alert
            await Alert.create({
              serviceId: service.id,
              status: 'triggered'
            });
          }
        }
      } else {
        // Reset service status if healthy
        service.lastAlert = null;
        service.alertCount = 0;
        service.isAcknowledged = false;
        service.assignedTo = null;
        await service.save(); // Save changes to service
      }
    }
  } catch (error) {
    console.error('Error performing health check', error);
  }
};
// Schedule health checks and email reports
const scheduleHealthChecks = () => {
  schedule.scheduleJob('*/20 * * * * *', performHealthCheck); // Run every 20 seconds
  schedule.scheduleJob('0 */6 * * *', emailService.sendHealthReports); // Run every 6 hours
  emailPollingService.scheduleEmailPolling();
};


module.exports = { performHealthCheck, scheduleHealthChecks };
