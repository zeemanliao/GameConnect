"use strict";
let requireHelper = require('./require_helper');
//let formValidator = requireHelper('form_validator');
let GameConnect = requireHelper('GameConnect');
let should = require('should');
let server,client,client2;
let testConfig = {
	server:{name:'test Server',port:3321,delay:100,kick:true},
	client:{port:3321,name:'test client'},
	data:{a:12,b:'321'}
};
describe('All Test', function() {
	describe('#create Error', function() {
        it('should catch server create error', function(done) {
        	let test = function(info) {
        		try {
        			GameConnect.createServer(info);
        		} catch(e) {
        			return true;
        		}
        		return false;
        	}
        	test().should.equal(true);
        	test({}).should.equal(true);
        	test({name:'123'}).should.equal(true);
        	test({name:'123',port:'321'}).should.equal(true);
        	test({name:'123',port:321}).should.equal(true);
        	done();
        });
        it('should catch client create error', function(done) {
        	try {
            	GameConnect.createClient();
            } catch (e) {
            	should.exist(e);
            	try {
	            	GameConnect.createClient({});
	            } catch (e) {
	            	should.exist(e);
	            	done();
	            }
            }
        });
    });

    describe('#create Server', function() {
        it('should create Server connect', function(done) {
            server = GameConnect.createServer(testConfig.server);
            should.exist(server);
            done();
        });
        it('should info equal', function(done) {
        	for (let i in testConfig.server) {
	            server.info[i].should.equal(testConfig.server[i]);
	        }
            done();
        });
    });

    describe('#create Client', function() {
        it('should create Client connect', function(done) {
            server.once('auth', function(client) {
            	testConfig.client.name.should.equal(client.name);
            	done();
            });
            client = GameConnect.createClient(testConfig.client);
        });
		it('should info equal', function(done) {
        	for (let i in testConfig.client) {
	            client.info[i].should.equal(testConfig.client[i]);
	        }
            done();
        });
    });

    describe('#Server Connect Test', function() {
        it('should Server.send data and Client got it', function(done) {
        	client.once('send Client Test', function(_data) {
        		for (let i in testConfig.data) {
          			testConfig.data[i].should.equal(_data[i]);
          		}
          		done();
        	});
            server.send(testConfig.client.name, 'send Client Test', testConfig.data);
            
        });

        it('should Server.sendAll data and Client got it', function(done) {
        	client.once('send all Client Test', function(_data) {
        		for (let i in testConfig.data) {
          			testConfig.data[i].should.equal(_data[i]);
          		}
          		done();
        	});
            server.sendAll('send all Client Test', testConfig.data);
        });
    });

    describe('#Client Connect Test', function() {
        it('should Client.send data and Server got it', function(done) {
        	server.once('send Server Test', function(client, _data) {
        		for (let i in testConfig.data) {
          			testConfig.data[i].should.equal(_data[i]);
          		}
          		done();
        	});
            client.send('send Server Test', testConfig.data);
            
        });
    });
    describe('#Client Start And Stop test', function() {
        it('should client stop and server update client statue', function(done) {
        	let _statue = 'stop';
        	server.once('clientStop', function(client) {
        		_statue.should.equal(client.statue);
          		done();
        	});
            client.stop();
        });
        it('should client start and server update client statue', function(done) {
        	let _statue = 'start';
        	server.once('clientStart', function(client) {
        		_statue.should.equal(client.statue);
          		done();
        	});
            client.start();
        });
    });

    describe('#Server Kick Test', function() {
    	it('should old client be kick', function(done){
    		client.once('disconnect', function() {
    			done();
    		});
    		client2 = GameConnect.createClient(testConfig.client);
    	});
    	it('should new client be kick', function(done){
    		server.info.kick = false;
    		client = GameConnect.createClient(testConfig.client);
    		client.once('disconnect', function() {
    			done();
    		});
    		
    	});
    });
    
    describe('#Connect Test', function() {
        it('should client Disconnect and Server got statue', function(done) {
        	server.once('clientDisconnect', function(client) {
        		testConfig.client.name.should.equal(client.name);
          		done();
        	});
            client2.close();
        });

        it('should client Reconnect and Server got statue', function(done) {
        	server.once('auth', function(client) {
        		testConfig.client.name.should.equal(client.name);
          		done();
        	});
        	client = GameConnect.createClient(testConfig.client);
        });
        it('should Server Disconnect Client', function(done) {
        	server.once('clientDisconnect', function(client) {
        		testConfig.client.name.should.equal(client.name);
          		done();
        	});
        	server.clients[testConfig.client.name].disconnect();
        });

    });

    describe('#Server Error Test', function() {
    	it('should Client after send Data disconnect', function(done) {
    		let _client = GameConnect.createClient(testConfig.client);
			server.once('auth', function(client) {
		    	delete server.clients[testConfig.client.name];
		    	_client.once('disconnect', function() {
		    		done();
		    	});
		    	_client.send('test');
	    	});
	    });
	    it('should Client after start disconnect', function(done) {
    		let _client = GameConnect.createClient(testConfig.client);
			server.once('auth', function(client) {
		    	delete server.clients[testConfig.client.name];
		    	_client.once('disconnect', function() {
		    		done();
		    	});
		    	_client.start();
	    	});
	    });
	    it('should Client after stop disconnect', function(done) {
    		let _client = GameConnect.createClient(testConfig.client);
			server.once('auth', function(client) {
		    	delete server.clients[testConfig.client.name];
		    	_client.once('disconnect', function() {
		    		done();
		    	});
		    	_client.stop();
	    	});
	    });
    });
    describe('#Close Test', function() {

    	it('should Server close', function(done) {
			server.close(function() {
				done();
			});
    	});
    });

});