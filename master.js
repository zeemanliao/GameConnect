var Connect = require('./index');

var master = Connect.createServer({name:'masterServer',port:999});


master.on('test', function(data){
	console.log(data);
});