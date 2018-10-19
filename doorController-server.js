const http = require("http")
const express = require('express');
const WebSocket = require('ws');
const uuid = require("uuid");
var gpio = require('rpi-gpio');
const jsonminify = require('jsonminify');



//mDNS publish
var bonjour = require('bonjour')()
bonjour.publish({ name: 'DoorLock', type: 'http', port: 1212 })

//rPI ports
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var Door = new Gpio(11, 'out'); //use GPIO pin 4, and specify that it is output



var app = express();
const port = 1212
process.setMaxListeners(0)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


wss.on('connection', function connection(ws,req) {
    ws.id = uuid.v4();
    ws.send(ws.id+"");
    ws.on('message', function incoming(data) {
        var data = JSON.parse(data);
        console.log(data)
        var command = data.command
        if(command == 'open_door') {
        	var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
			var Door = new Gpio(11, 'out'); //use GPIO pin 4, and specify that it is output
        	var blinkInterval = setInterval(blinkDoor, 10); //run the blinkLED function every 250ms

        	function blinkDoor() { //function to start blinking
			  	if (Door.readSync() === 0) { //check the pin state, if the state is 0 (or off)
			    	Door.writeSync(1); //set pin state to 1 (turn LED on)
			  	} else {
			    	Door.writeSync(0); //set pin state to 0 (turn LED off)
			  	}
			}

			function endBlink() { //function to stop blinking
			  	clearInterval(blinkInterval); // Stop blink intervals
			  	Door.writeSync(0); // Turn LED off
			  	Door.unexport(); // Unexport GPIO to free resources
			}
			setTimeout(endBlink, 20); //stop blinking after 5 seconds

        }
    })
});






server.listen(port, () => {
  console.log(`Server active on port: ${server.address().port}`);
});
