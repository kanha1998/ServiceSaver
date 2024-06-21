const nodemailer = require('nodemailer');
const Service = require('../models/develop/serviceModel');
const Alert = require('../models/develop/alertModel');
const Environment = require('../models/develop/alertModel');
const moment = require('moment');
const {Op}  = require('sequelize');
const { getServicesGroupedByService } = require('../controllers/dataController');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAlert = async (service) => {
  const environmentName = service.Environment ? service.Environment.environment_name : service.id;
  const htmlContent = `
    <p>Hi Team,</p>
    <p>Urgent action is required! The following service is down:</p>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr style="background-color: #ADD8E6;">
          <th>Service ID</th>
          <th>Service Name</th>
          <th>Service URL</th>
          <th>Environment Name</th>
          <th>Health Status</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background-color: red;">
          <td>${service.id}</td>
          <td>${service.name}</td>
          <td>${service.url}</td>
          <td>${environmentName}</td>
          <td>RED</td>
        </tr>
      </tbody>
    </table>
    <p>Please reply to this email to take ownership of the issue and investigate and resolve it promptly.</p>
  `;
  const stakeholdersSet = new Set();
  const stakeholders = service.stakeholders.split(',').map(email => email.trim());
  stakeholders.forEach(email => {
    if (email) {
      stakeholdersSet.add(email);
    }
  });
  const recipients = Array.from(stakeholdersSet).join(',');
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to:   recipients,
    subject: `Service Alert: ${service.name} is Down`,
    html: htmlContent,
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
        health_status: {
          [Op.not]: 'GREEN' 
        }
      }
    });

    if (service) {
      service.assigned_to = assignee;
      service.is_acknowledged = true;
      service.alert_count = 0;
      service.health_status = 'YELLOW';
      await service.save();


      let today = moment().startOf('day');
      let tomorrow = moment(today).add(1, 'day');
      
      let alert = await Alert.findOne({ 
        where: { 
          service_id: service.id,
          status: 'TRIGGERED',
          created_at: {
            [Op.gte]: today.toDate(),
            [Op.lt]: tomorrow.toDate()
          }
        } 
      });

      if (!alert) {
        alert = await Alert.create({
          service_id: service.id,
          status: 'TRIGGERED',
          updated_by : 'SYSTEMBOT'
        });
      }

      alert.acknowledged_by = assignee;
      alert.status = 'ACKNOWLEDGED';
      alert.updated_at = created_at;
      alert.updated_by = 'SYSTEMBOT';
      await alert.save();

      console.log(`Service ${service.name} acknowledged by ${assignee} successfully`);
    } else {
      console.log(`Service with name ${serviceName} not found might be in Green State`);
    }
  } catch (error) {
    console.error('Error handling email reply:', error);
  }
};

module.exports = { sendAlert, handleEmailReply };
