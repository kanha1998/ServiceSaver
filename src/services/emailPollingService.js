const imaps = require('imap-simple');
const schedule = require('node-schedule');
const Service = require('../models/serviceModel');
const Alert = require('../models/alertModel'); 
const emailService = require('./emailService'); 


const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions : {rejectUnauthorized:false},
    headers:{
      'Content-Type':'application/x-www-form-urlencoded',
    },
    authTimeout: 3000,
  },
};

const fetchEmails = async () => {
  try {
    const connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN'];
    const fetchOptions = { bodies: ['HEADER', 'TEXT'], markSeen: true };

    const messages = await connection.search(searchCriteria, fetchOptions);

    for (const item of messages) {
      const email = {
        text: item.parts.find(part => part.which === 'TEXT').body
      };

      await emailService.handleEmailReply(email);
    }

    await connection.end();
  } catch (error) {
    console.error('Error fetching emails:', error);
  }
};


const scheduleEmailPolling = () => {
  schedule.scheduleJob('*/15 * * * * *', fetchEmails); // Every 15 seconds
};

module.exports = { fetchEmails, scheduleEmailPolling };
