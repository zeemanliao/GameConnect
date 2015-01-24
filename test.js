var test = require('./index');

var client = test.createClient({name:"test", ip:"localhost", port:8001});
var masterClient = test.createClient({name:"test", ip:"localhost", port:999});
var i = 0;
//run();
client.send('test',{test:1});
client.send('test',{test:2});
client.send('test',{test:3});
client.send('test',{test:4});


client.on('test',function(data){
	console.log('get Server Data:%s',data.test);
});
