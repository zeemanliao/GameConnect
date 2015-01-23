var Connect = require('./index');

var master = Connect.createServer({port:999});

master.send('allState');

master.on('connect', function(data){
	console.log(data);
});