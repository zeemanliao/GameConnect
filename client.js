<<<<<<< HEAD
'use strict';
=======
>>>>>>> 7c409cd433fef69618b487ede4e6a91db3933035
var GameConnect = require('./index');

var client = GameConnect.createClient({name:'testClient',ip:'localhost',port:999});
client.send('start');
client.on('test', function(data){
	console.log("test:%1",data);
});

client.on('connect', function(){
	console.log('connected');
	client.send('test','test');
});

client.on('disconnect', function(){
	console.log('server disconnect');
});