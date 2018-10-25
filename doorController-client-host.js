const WebSocket = require('ws');
var keypress = require('keypress');
var os = require('os');
var address,port;

var daemon = false;
var connected = false;
var bonjour = null;
var keypressStarted = false;

//If not connected in 10 seconds then die
setTimeout(function() {
	console.log('Why am I still up?? May be the server died. Good bye..');
	process.exit(1);
}, 5000);

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
				if(process.argv[2] == "open_door") {
					ws.send(JSON.stringify({
						"command": "open_door",
						"user":  os.hostname
					},null,4));
					process.exit(1);
				} else if(process.argv[2]){
					console.log('Unknown command %s! Exiting..', process.argv[2]);
					process.exit(1);
				}
			});

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

			// if(!keypressStarted) {
			// 	process.stdin.on('keypress', function (ch, key) {
			// 		keypressStarted = true;
			// 		if(seq.length >= 3) {
			// 			seq.shift();
			// 		}
			// 		if(key && key.name) {
			// 			seq.push(key.name);
			// 		}

			// 		if (key && key.ctrl && key.name == 'c' && !daemon) {
			// 		    process.stdin.pause();
			// 		    process.exit()
			// 		} else if(seq[0] == 'o' && seq[1] == 'o' && seq[2] == 'o' && connected) {
			// 			seq = [];
			// 		// if( key && key.ctrl && key.name == 'c') {
			// 			console.log(new Date().toISOString() + " Hello " + os.hostname + ", at your service commading the door to open...");
			// 			ws.send(JSON.stringify({
			// 					"command": "open_door",
			// 					"user":  os.hostname
			// 				},null,4)
			// 			);
			// 		}

			// 		process.stdin.setRawMode(true);
			// 		process.stdin.resume();
			// 	});
			// }

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


// var net = require('net');
// var fs = require('fs');
// var SOCKETFILE = "/var/run/ww-india-doorlock.sock";
// // prevent duplicate exit messages
// var SHUTDOWN = false;

// function createServer(sockfile) {
// 	// This server listens on a Unix socket at /var/run/mysocket
// 	var unixServer = net.createServer(function(client) {
// 	    // Do something with the client connection
// 	    console.log('hey');
// 	});
// 	unixServer.listen(sockfile, function() {
// 		console.log('sever is listening');
// 	});
// }


// // check for failed cleanup
// console.log('Checking for leftover socket.');
// fs.stat(SOCKETFILE, function (err, stats) {
//     if (err) {
//         // start server
//         console.log('No leftover socket found.');
//         server = createServer(SOCKETFILE); return;
//     }
//     // remove file then start server
//     console.log('Removing leftover socket.');
//     fs.unlink(SOCKETFILE, function(err){
//         if(err){
//             // This should never happen.
//             console.error(err); process.exit(0);
//         }
//         server = createServer(SOCKETFILE); return;
//     });
// });

// // close all connections when the user does CTRL-C
// function cleanup(){
//     if(!SHUTDOWN){ SHUTDOWN = true;
//         console.log('\n',"Terminating.",'\n');
//         if(Object.keys(connections).length){
//             let clients = Object.keys(connections);
//             while(clients.length){
//                 let client = clients.pop();
//                 connections[client].write('__disconnect');
//                 connections[client].end();
//             }
//         }
//         server.close();
//         process.exit(0);
//     }
// }
// process.on('SIGINT', cleanup);


