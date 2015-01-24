var Connect = require('./index');

var master = Connect.createServer({name:'masterServer',port:999});

master.on('connect', function(data){
	console.log(data);
});

master.on('disconnect', function(info){
	console.log('Client Disconnect:',info.name);
});