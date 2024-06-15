module.exports = {
	connection: 'mongodb+srv://root:root@cluster0.5d0hfee.mongodb.net',
	interval: 10000,

	logentries: {
		token: null
	},
	monitor: {
		http: [
			{
				url: 'https://likeastore.com'
			},
			{
				url: 'https://stage.likeastore.com'
			}
		],
	},

	// notification options
	notify: {
		email: {
			from: 'abhikiit2016@gmail.com',
			to: ['shatabhishek@gmail.com','debasishmahana49@gmail.com']
		},

		sms: {
			to: ['+919178056157']
		}
	},

	transport: {
		mandrill: {
			token: 'fake-token'
		},

		sendMail:{
			apiKey:'mlsn.cd8cca72a3ca1cd0d750064a7302d4fe745d6d2039423113c421fde4405ae627'

		},
		twilio: {
			sid: 'AC42b341a8f669b323aac3aba08cfabe79',
			token: '1b0a845cee7dfa9c5800efa3f32cfa41'
		}
	}
};
