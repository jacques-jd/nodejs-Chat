let chat, uname, msg;

window.onload = () => { //init
	chat = document.querySelector("#chat");
	uname = document.querySelector("#name");
	msg = document.querySelector("#msg");
	let socket = new WebSocket('ws://localhost:8080');
	
	socket.onopen = function(event) {
		console.log("Connected to server");
		socket.send('"Bot": "Welcome to chat!"');
	}

	socket.onmessage = function(event) {
		console.log("Recevied raw data: ", event.data);
		data = JSON.parse("{" + event.data + "}");
		console.log("Received: ", data);
		for(var sender in data)
		{
			console.log(sender);
			chatmsg = document.createTextNode(`${sender}: ${data[sender]}`);
			br = document.createElement("br");
			chat.appendChild(chatmsg);
			chat.appendChild(br);
		}
	};

	document.querySelector("#send").addEventListener("click", () => {
		var message = `"${uname.value}":"${msg.value}"`;
		console.log("Sending: ", message);
		socket.send(message);
	});
	/*
	const xhttp = new XMLHttpRequest();
	document.querySelector("#send").addEventListener("click", ()=>{
		const xhttp = new XMLHttpRequest();
		
		xhttp.open("POST", "http://localhost:8080");
		xhttp.onload = function() {
			console.log(this.responseText);
			chat.innerHTML = this.responseText;
		};

		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(`uname=${uname.value}&msg=${msg.value}`);
		
	});
	*/
	
};

