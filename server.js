const http = require("http");
const qs = require("querystring");
const express = require("express");

const PORT = process.env.PORT || 3000;
const INDEX = 'index.html';

const server = express()
  .use(express.static(__dirname + '/'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const { Server } = require('ws')
const wss = new Server({ server });

var chat = [];
var users = [];

wss.on('connection', ws => {
	console.log("Connected to server.");
	if(chat.length) {
		console.log("Updating chat...");
		
		ws.send(JSON.stringify(chat));
	}

	ws.on('message', message => {
		const data = JSON.parse(message.toString());
		switch(data.type)
		{
		case "message":

			console.log("Received message, sending to client...", data);
			chat.push(data);
			
			ws.send(JSON.stringify(chat));

			console.log("Sending chat to all other clients...");
			wss.clients.forEach(client => {
				console.log(client.readyState);
				if(client!==ws /*&& client.readyState===Server.OPEN*/)
					client.send(JSON.stringify(chat));
			});

		break;

		case "login":

			console.log("User connected.. Sending to client...", data);
			users.push(data);

			ws.send(JSON.stringify(users));

			console.log("Sending new connect to other clients..");
			wss.clients.forEach(client => {
				console.log(client.readyState);
				if(client!==ws /*&& client.readyState===Server.OPEN*/)
					client.send(JSON.stringify(users));
			});

		break;
		case "exit":

			console.log("User disconnected.. Sending to client...", data);
			users.splice(users.findIndex(element => element.user == data.user),1);

			ws.send(JSON.stringify(users));

			console.log("Sending D/C to other clients..");
			wss.clients.forEach(client => {
				console.log(client.readyState);
				if(client!==ws /*&& client.readyState===Server.OPEN*/)
					client.send(JSON.stringify(users));
			});

		break;
		case "ping":
			console.log("Updating User list, ping received from ", data.user);
			users.splice(users.findIndex(element => element.user == data.user),1);
			users.push(data);
			ws.send(JSON.stringify(users));
		break;
		}
	});
});

wss.on("close", ws => {

});