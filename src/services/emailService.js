const nodemailer = require('nodemailer');
const Service = require('../models/serviceModel');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlert = async (service) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'support@example.com',
    subject: `Service Alert: ${service.name} is Down`,
    text: `The service ${service.name} is currently down. Please reply to this email to take ownership of the issue.`,
  };

  await transporter.sendMail(mailOptions);
};

const handleEmailReply = async (email) => {
  const serviceName = email.subject.split(': ')[1].split(' is Down')[0];
  const service = await Service.findOne({ name: serviceName });

  if (service) {
    service.assignedTo = email.from.value[0].address;
    service.isAcknowledged = true;
    service.alertCount = 0;
    await service.save();
  }
};

const sendHealthReports = async () => {
  const services = await Service.find();

  for (const service of services) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: service.stakeholders.join(','),
      subject: `Health Report: ${service.name}`,
      text: `Health report for ${service.name}: \nURL: ${service.url}\nStatus: ${service.isAcknowledged ? 'Down' : 'Up'}`,
    };

    await transporter.sendMail(mailOptions);
  }
};

module.exports = { sendAlert, handleEmailReply, sendHealthReports };
