<<<<<<< HEAD
'use strict';
=======
>>>>>>> 7c409cd433fef69618b487ede4e6a91db3933035
var Connect = require('./index');

var master = Connect.createServer({name:'masterServer',port:999});

var webMaster = Connect.createServer({name:'webMasterServer',port:1978});
master.on('before', function(client, cmd){
	cmd.run = false;
});
master.on('test',function(client, data){
	console.log('test1:%1',data);
});
master.on('test',function(client, data){
	console.log('test2:%1',data);
});
master.on('test',function(client, data){
	console.log('test3:%1',data);
});
master.on('test',function(client, data){
	console.log('test4:%1',data);
	master.send(client.name, 'getNewID', data);
});
master.on('after', function(client, channel, data){
	console.log('after');
	/*
	console.log('Client Name:%s,Action channel:%s',client.info.name,channel);
	console.log('Client Data:');
	console.log(data);
	*/
});

webMaster.on('after', function(client, channel, data){
	console.log('Client Name:%s',channel);
	console.log('Client Data:');
	console.log(data);
});


