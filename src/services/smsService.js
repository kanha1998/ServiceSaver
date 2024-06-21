const twilioClient = require('../config/twilioConfig');

const sendSMSAlert = async (service) => {
  const message = `
  ALERT: Service Down
  Service Name: ${service.name}
  Service URL: ${service.url}
  Environment: ${service.Environment.environment_name}
  Health Status: RED

  Please investigate and resolve the issue promptly.
`;
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: ['+919679841858','+919178056157']
  });
};

module.exports = { sendSMSAlert };
