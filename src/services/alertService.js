const emailService = require('./emailService');
const smsService = require('./smsService');

const sendAlert = async (service) => {
  await emailService.sendAlert(service);
  await smsService.sendSMSAlert(service);
};

module.exports = { sendAlert };
