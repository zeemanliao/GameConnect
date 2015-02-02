var GameConnect = require('./index');

var client = GameConnect.createClient({name:'testClient',ip:'localhost',port:999});



client.on('connect', function(){
	client.send('auth',{pwd:"123"});
});