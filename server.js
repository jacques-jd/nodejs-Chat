const http = require("http");
const qs = require("querystring");
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 });

var chat = [];

wss.on('connection', ws => {
	console.log("Connected to server.");
	if(chat != []) {
		console.log("Updating chat...");

		ws.send(JSON.stringify(chat));
	}

	ws.on('message', message => {
		const data = JSON.parse(message.toString());
		if(data.type == "message")
		{
			console.log("Received message, sending to client...", data);
			chat.push(data);
			
			ws.send(JSON.stringify(chat));

			console.log("Sending to all other clients...")
			wss.clients.forEach(client => {
				if(client!==ws && client.readyState===WebSocket.OPEN)
					client.send(JSON.stringify(chat));
			});
		}
		
	});
});

wss.on("close", ws => {

});