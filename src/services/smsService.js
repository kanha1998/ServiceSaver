const twilioClient = require('../config/twilioConfig');

const sendSMSAlert = async (service) => {
  const message = `Alert: The service ${service.name} is currently down. Please check the service.`;

  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: 'recipient_phone_number',  // Replace with actual recipient phone number
  });
};

module.exports = { sendSMSAlert };
