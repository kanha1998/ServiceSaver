var config = require('./config');
var heartbeat = require('./source/heartbeat');


var express = require('express');
	var app = express();


    app.listen(3000);

    

    app.get("/",(req,res)=>{
        heartbeat(config,req,res).start();
       //  res.send("ok");
    });