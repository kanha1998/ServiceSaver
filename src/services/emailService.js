const nodemailer = require('nodemailer');
const Service = require('../models/serviceModel');
const Alert = require('../models/alertModel');
const moment = require('moment');
const {Op}  = require('sequelize');


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

    const textLines = email.text.split('\n');
    let content = '';
    let assignee = '';
    let serviceName = '';
    let timestamp = '';

    if (textLines.length > 0) {
      content = textLines[0].trim();

      const assigneeLineIndex = textLines.findIndex(line => line.includes('Thanks and Regards'));
      if (assigneeLineIndex !== -1 && assigneeLineIndex < textLines.length - 1) {
        assignee = textLines[assigneeLineIndex + 1].trim();
      }

      const serviceLine = textLines.find(line => line.includes('The service'));
      if (serviceLine) {
        const match = serviceLine.match(/The service (.+) is currently down/);
        if (match) {
          serviceName = match[1];
        }
      }

      const timestampLineIndex = textLines.findIndex(line => line.includes('On '));
      if (timestampLineIndex !== -1) {
        const timestampString = textLines[timestampLineIndex].replace('On ', '').replace(' at ', ' ');
        const parsedDate = moment(timestampString, 'ddd, DD MMM YYYY HH:mm');
        if (parsedDate.isValid()) {
          timestamp = parsedDate.format('YYYY-MM-DD HH:mm:ss');
        }
      }
    }

    console.log(`Content: ${content}`);
    console.log(`Assignee: ${assignee}`);
    console.log(`Service Name: ${serviceName}`);
    console.log(`UpdateTimestamp: ${timestamp}`);

    const service = await Service.findOne({
      where: {
        name: serviceName,
        healthStatus: {
          [Op.not]: 'GREEN' 
        }
      }
    });

    if (service) {
      service.assignedTo = assignee;
      service.isAcknowledged = true;
      service.alertCount = 0;
      service.healthStatus = 'YELLOW';
      await service.save();


      let today = moment().startOf('day');
      let tomorrow = moment(today).add(1, 'day');
      
      let alert = await Alert.findOne({ 
        where: { 
          serviceId: service.id,
          status: 'triggered',
          timestamp: {
            [Op.gte]: today.toDate(),
            [Op.lt]: tomorrow.toDate()
          }
        } 
      });

      if (!alert) {
        alert = await Alert.create({
          serviceId: service.id,
          status: 'triggered'
        });
      }

      alert.acknowledgedBy = assignee;
      alert.status = 'acknowledged';
      alert.updatedAt = timestamp;
      await alert.save();

      console.log(`Service ${service.name} acknowledged by ${assignee} successfully`);
    } else {
      console.log(`Service with name ${serviceName} not found might be in Green State`);
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
