const { logger } = require('node-logentries');





const { MongoClient } = require('mongodb');




module.exports =  function (config, connection)  {
	connection = connection || 'connection';
	
     
	const client = new MongoClient(config[connection]);

client.on('commandStarted', started => console.log(started));
	//console.log(client.db("heartbeats"));
	console.log('Connecting to MongoDB');

	try {
		client.connect().then(()=>{
			console.log('Connected successfully to MongoDB ');
		

		}
			).catch((e)=> console.log(e));
	

	}
	catch (err) {
		console.error('Error connecting to MongoDB:', err);
	  } 
 
	
   //console.log(client.db("heartbeats").collection("heartbeats"));
	return   client.db("heartbeats").collection("heartbeats");
};





/*

const fs = require('node:fs/promises');
 async function insertDb() {
  try {
    const content = 'Some content!';
    await fs.writeFile('file.txt', content);
  } catch (err) {
    console.log(err);
  }
}

export default insertDb;

*/
