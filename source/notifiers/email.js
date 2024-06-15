var logger = require('../utils/logger');
var transport = require('../transport');

const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

module.exports = function email (options, failure, callback) {
	var text = JSON.stringify(failure);
	var subject = '[Heartbeat] Service ' + failure.url + ' failed.';
	var from = options.from;
	var to = options.to.map(function (t) {
		return {email: t};
	});

  
	var message = {
		text: text,
		subject: subject,
		from_email: from,
		to: options.to
	};

try{

	transport.nodemailer.sendMail(message);


}


catch(e)
{
	console.log(e);
}
	/*
	const sentFrom = new Sender(from, "Server Saver");

const recipients = [
  new Recipient(to, "Server Saver")
];

const emailParams = new EmailParams()
.setFrom(sentFrom)
.setTo(recipients)
.setReplyTo(sentFrom)
.setSubject(subject)
.setText(text);
	logger.info('sending mandrill notification');



	try{
		transport.mailSender.email.send(emailParams);

	}catch(e)
	{

		 console.log(e);
	}

	
	*/
	
};
