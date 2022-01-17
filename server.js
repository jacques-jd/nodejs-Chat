const http = require("http");
const qs = require("querystring");
const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 8080 });

var chat = [];

wss.on('connection', ws => {
	console.log("connected to ws");
	ws.on('message', message => {
		const data = message.toString();
		console.log("received message: ", data);
		chat.push(data);
		ws.send(chat.toString());
		
		/*wss.clients.forEach(function (client){
			console.log(client);
			if(client!==ws && client.readyState===WebSocket.OPEN)
            {
                client.send(chat.toString());
            }
		});*/
	});
});


/*
http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Access-Control-Allow-Origin': '*'
	});

	let body = '';

	req.on('data', data => {
		
		body+=data; 

		if(body.length > 1e6) 
			req.socket.destroy();
	});

	req.on("end", () => {
		const data = qs.parse(body);

		console.log("Data received. Updating chat with newest data..: ", data);
		chat.push([data.uname, data.msg])
		chatBox = '';
		for(var msg of chat)
		{
			chatBox += `${msg[0]} : ${msg[1]} <br>`;
		}
		if (chatBox != '') 
		{
			res.write(chatBox);
		}
		res.end();
	});
}).listen(8080);
*/