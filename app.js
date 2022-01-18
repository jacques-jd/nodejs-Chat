let chat, uname, msg, ip, ucolor, msgcolor, txtcolor, connectbutton;
window.onload = () => {
	ip = document.querySelector("#ip");
	chat = document.querySelector("#chat");
	uname = document.querySelector("#name");
	msg = document.querySelector("#msg");
	ucolor = document.querySelector("#namecolor");
	msgcolor = document.querySelector("#messagecolor");
	txtcolor = document.querySelector("#txtcolor");

	connectbutton = document.querySelector("#connect");

	if(uname.value.length >= 3)
		connectbutton.removeAttribute("disabled");

	uname.addEventListener("input", function() {
		if(uname.value.length >= 3)
			connectbutton.removeAttribute("disabled");
		else
			connectbutton.setAttribute("disabled","");
	});

	connectbutton.onclick = () => {
		chat.innerHTML = "";

		let socket = new WebSocket(`ws://${ip.value}:8080`);
		
		socket.onopen = function(event) {
			console.log("Connection opened");
		}

		socket.onclose = function(event) {

		}
	
		socket.onmessage = function(event) {
			console.log("Received message. Clearing chat.");
	
			chat.innerHTML = "";
	
			console.log("Parsing JSON Data: ", event.data);
	
			const data = JSON.parse(event.data);
			console.log("Iterating over messages. ");
			for(var message of data)
			{
				console.log("Message sender: ", message.user);
				console.log("Message contents: ", message.msg);
				console.log("Colors: " + message.usercolor + "," + message.msgcolor + "," + message.txtcolor);
	
				chatmsg = document.createElement("span");
				chatmsgname = document.createElement("b");
				
				chatmsgname.appendChild(document.createTextNode(`${message["user"]}: `));
				chatmsgcontent = document.createTextNode(message["msg"]);
	
				chatmsgname.style.color = message.usercolor;
				chatmsg.style.color = message.txtcolor;
				chatmsg.style.backgroundColor = message.msgcolor;
	
				chatmsg.appendChild(chatmsgname);
				chatmsg.appendChild(chatmsgcontent);
				chat.appendChild(chatmsg);
			}
		};
	
		document.querySelector("#send").addEventListener("click", () => {
			//Error catching
			if(uname.value.length < 3) {
				alert("You need a username of 3 chars minimum!");
				return;
			}
			if(msg.value.trim().length < 1) {
				return;
			}
			var message = JSON.stringify({
				"type": "message",
				"user": uname.value,
				"msg": msg.value,
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
				"txtcolor": txtcolor.value
			});
			console.log("Sending: ", message);
			socket.send(message);
			msg.value = "";
			msg.focus();
		});
	
		msg.addEventListener("keyup", event => {
			if (event.keyCode === 13) {
			  event.preventDefault();
			  document.querySelector("#send").click();
			}
		}); 
	};	
};


