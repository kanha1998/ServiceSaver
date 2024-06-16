function generateAlertEmail(service) {
    return `
      <h1>Service Alert: ${service.name} is Down</h1>
      <p>The service ${service.name} is currently down. Please reply to this email to take ownership of the issue.</p>
    `;
  }
  
  module.exports = { generateAlertEmail };
  