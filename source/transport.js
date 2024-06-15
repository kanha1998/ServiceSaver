var mandrill = require('node-mandrill');
var twilio = require('twilio');
var config = require('../config');
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const nodemailer = require('nodemailer');



var setupMandrill = function () {
	if (!validConfig()) {
		throw new Error('missing mandrill token, please update config.transport.mandrill section');
	}

	return mandrill(config.transport.mandrill.token);

	function validConfig() {
		return config.transport.mandrill && config.transport.mandrill.token;
	}
};

var setUpNodeMailer = function (){


	return new nodemailer.createTransport({
		service: 'gmail', // Use any email service provider like 'gmail', 'yahoo', 'hotmail', etc.
		auth: {
			user: 'abhikiit2016@gmail.com', // Replace with your email
			pass: 'rcgwccluirqaxcgl'
		}
	});
}



var setMailerSender  =  function(){

	return new MailerSend({
		apiKey: config.transport.sendMail.apiKey
	  });
}

var setupTwilio = function () {
	if (!validConfig()) {
		throw new Error('missing twilio account SID or auth Token, please update config.transport.twilio section');
	}

	return twilio(config.transport.twilio.sid, config.transport.twilio.token);

	function validConfig() {
		return config.transport.twilio && (config.transport.twilio.sid && config.transport.twilio.token);
	}
};

var transport = {
	mandrill: setupMandrill(),
	twilio: setupTwilio(),
	mailSender:setMailerSender(),
	nodemailer:setUpNodeMailer()
};

module.exports = transport;
