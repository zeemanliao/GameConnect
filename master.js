var Connect = require('./index');

var master = Connect.createServer({name:'masterServer',port:999,kick:false});
master.on('before', function(client, cmd){
	cmd.run = false;
});
master.on('test',function(client, data){
	console.log('test1:%s',data);
});
master.on('test',function(client, data){
	console.log('test2:%s',data);
});
master.on('test',function(client, data){
	console.log('test3:%s',data);
});
master.on('test',function(client, data){
	console.log('test4:%s',data);
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
