let chat, uname, msg;

window.onload = () => { //init
	chat = document.querySelector("#chat");
	uname = document.querySelector("#name");
	msg = document.querySelector("#msg");
	let socket = new WebSocket('ws://localhost:8080');
	
	socket.onopen = function(event) {
		console.log("Connected to server");
	}

	socket.onmessage = function(event) {
		console.log("Clearing chat... ");
		chat.innerHTML = "";
		console.log("Recevied raw data: ", event.data);
		const data = JSON.parse(event.data);
		console.log("Received: ", data);
		for(var rawmessage of data)
		{
			let message = JSON.parse(rawmessage);
			console.log("Iterating message: ", message);
			console.log("Message sender: ", message.user);
			console.log("Message contents: ", message.msg);
			chatmsg = document.createElement("span");
			chatmsgname = document.createElement("b");
			chatmsgname.appendChild(document.createTextNode(`${message["user"]}: `));
			chatmsgcontent = document.createTextNode(message["msg"]);
			chatmsg.appendChild(chatmsgname);
			chatmsg.appendChild(chatmsgcontent);
			chat.appendChild(chatmsg);
		}

		/*data.map((element, index) => {
			console.log(element + ", by " + index);
			chatmsg = document.createTextNode(`${index}: ${element}`);
			br = document.createElement("br");
			chat.appendChild(chatmsg);
			chat.appendChild(br);
		});*/
	};

	document.querySelector("#send").addEventListener("click", () => {
		var message = JSON.stringify({
			"user": uname.value,
			"msg": msg.value
		});
		console.log("Sending: ", message);
		socket.send(message);
	});

	msg.addEventListener("keyup", event => {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
		  // Cancel the default action, if needed
		  event.preventDefault();
		  // Trigger the button element with a click
		  document.querySelector("#send").click();
		}
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

