const schedule = require('node-schedule');
const axios = require('axios');
const Service = require('../models/serviceModel');
const alertService = require('./alertService');

const checkService = async (service) => {
  try {
    const response = await axios.get(service.url);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const performHealthCheck = async () => {
  const services = await Service.find();

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
        await service.save();
      }
    } else {
      service.lastAlert = null;
      service.alertCount = 0;
      service.isAcknowledged = false;
      service.assignedTo = null;
      await service.save();
    }
  }
};

const scheduleHealthChecks = () => {
  schedule.scheduleJob('*/10 * * * * *', performHealthCheck); // Run every 10 seconds
  schedule.scheduleJob('0 */6 * * *', emailService.sendHealthReports); // Run every 6 hours
};

module.exports = { performHealthCheck, scheduleHealthChecks };
