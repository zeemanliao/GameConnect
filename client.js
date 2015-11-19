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