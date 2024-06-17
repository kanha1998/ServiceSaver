const nodemailer = require('nodemailer');
const Service = require('../models/serviceModel');
const Alert = require('../models/alertModel');
const { Op } = require('sequelize');


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
    to: service.stakeholders.join(','),
    subject: `Service Alert: ${service.name} is Down`,
    text: `The service ${service.name} is currently down. Please reply to this email to take ownership of the issue.`,
  };

  await transporter.sendMail(mailOptions);
};

const handleEmailReply = async (email) => {
  try {
    const serviceName = email.subject.split(': ')[1].split(' is Down')[0].trim();
    const service = await Service.findOne({ where: { name: serviceName } });

    if (service) {
      service.assignedTo = email.from.value[0].address;
      service.isAcknowledged = true;
      service.alertCount = 0;
      await service.save();

      await Alert.update(
        { acknowledgedBy: email.from.value[0].address, status: 'acknowledged' },
        { where: { serviceId: service.id, status: 'triggered' } }
      );

      console.log(`Service ${service.name} acknowledged by ${service.assignedTo} successfully`);
    }
  } catch (error) {
    console.error('Error handling email reply:', error);
  }
};

const sendHealthReports = async () => {
  const services = await Service.findAll();

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
