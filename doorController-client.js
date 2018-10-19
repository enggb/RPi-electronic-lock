const WebSocket = require('ws');
var keypress = require('keypress');
var os = require('os');
var address,port;

var daemon = false;
var connected = false;
var bonjour = null;
var keypressStarted = false;

function connect() {
	if(bonjour) {
		bonjour.destroy();
	}
	bonjour = require('bonjour')();
	bonjour.find({ type: 'http' }, function (service) {
		if(service.name == "DoorLock") {
			console.log('Here in bonjour');
			connected = true;
		  	address = service.addresses[0]
		  	port = service.port
		  	console.log(address+ " on "+  port)
		  	var uri = "http://"+address+":"+port
		  	keypress(process.stdin);

			ws = new WebSocket(uri);
			
			ws.removeEventListener('open')
			ws.on('open',function open(){
				console.log("opened")
				ws.send(JSON.stringify({
								"name": "connected",
								"status":  "true"
							},null,4)
						);
			})

			ws.removeEventListener('close')
			ws.on('close', function close(err) {
				console.log("Events websocket disconnected " + err);
				connected = false;
				tryConnect();
			})

			ws.removeEventListener('error')
			ws.on('error', function error (err) {
				console.log("Error " + err);
				connected = false;
				tryConnect();
			})

			var seq = [];
			
			if(!keypressStarted) {
				process.stdin.on('keypress', function (ch, key) {
					keypressStarted = true;
					if(seq.length >= 3) {
						seq.shift();
					}
					if(key && key.name) {
						seq.push(key.name);
					}

					if (key && key.ctrl && key.name == 'c' && !daemon) {
					    process.stdin.pause();
					    process.exit()
					} else if(seq[0] == 'o' && seq[1] == 'o' && seq[2] == 'o' && connected) {
						seq = [];
					// if( key && key.ctrl && key.name == 'c') {
						console.log(new Date().toISOString() + " Hello " + os.hostname + ", at your service commading the door to open...");
						ws.send(JSON.stringify({
								"command": "open_door",
								"user":  os.hostname
							},null,4)
						);
					}

					process.stdin.setRawMode(true);
					process.stdin.resume();
				});
			}

			//For some reason we have to press enter for the first key press
			//Hack to get it working
			process.stdin.emit('keypress', null, {'name': 'a'});

		}
	});

	function tryConnect() {
		if(!connected) { 
			setTimeout(function() {
				if(!connected) {
					console.log("Destroying");
					bonjour.destroy();
					console.error('Not connected yet! Trying to connect again.');
					connect();
				}
			}, 10000);
		}
	}

	tryConnect();
}

connect();




