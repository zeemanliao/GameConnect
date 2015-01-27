var Connect = require('./index');

var master = Connect.createServer({name:'masterServer',port:999});


master.on('test', function(client, data){
	console.log(data);
});

master.on('login', function(client, data){
	console.log(data);
});