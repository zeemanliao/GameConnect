var Connect = require('./index');

var master = Connect.createServer({name:'masterServer',port:999,auth:true});

var webMaster = Connect.createServer({name:'webMasterServer',port:1978,auth:true});

master.on('log', function(client, data){
	console.log('Client Name:%s,Action Name:%s',client.info.name,data.name);
	console.log('Client Data:');
	console.log(data.data);
});
webMaster.on('log', function(client, data){
	console.log('Client Name:%s',data.name);
	console.log('Client Data:');
	console.log(data.data);
});
webMaster.on('auth', function(webClient, data){

	webClient.auth = data.name =="zeeman" && data.pass =="123";
	if (webClient.auth) {
		webClient.statue = "start";
		//webMaster.send(client.info.name, "javascript" ,{name:"test",fun:"alert(a);\nalert(b);\nalert(c);",args:'a,b,c'});
		for (var i in master.clients) {
			var client = master.clients[i];
			webMaster.send(webClient.info.name, "server", client.info);
		}
	}
});

master.on('auth', function(client, data){
	if (!client.auth &&
		data.pwd == '123') {
		client.auth = true;
	}
});