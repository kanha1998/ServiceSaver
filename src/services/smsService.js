const twilioClient = require('../config/twilioConfig');

const sendSMSAlert = async (service) => {
  const message = `Alert: The service ${service.name} is currently down. Please check the service.`;

  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: '+919679841858', 
  });
};

module.exports = { sendSMSAlert };
