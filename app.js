let chat, uname, msg, ip, connectbutton;
window.onload = () => {
	connectbutton = document.querySelector("#connect");
	connectbutton.onclick = () => {
		ip = document.querySelector("#ip").value;
		chat = document.querySelector("#chat");
		uname = document.querySelector("#name");
		msg = document.querySelector("#msg");
		ucolor = document.querySelector("#namecolor");
		msgcolor = document.querySelector("#messagecolor");
		txtcolor = document.querySelector("#txtcolor");
	
		chat.innerHTML = "";

		msg.focus();
	
		let socket = new WebSocket(`ws://${ip}:8080`);
		
		socket.onopen = function(event) {
			console.log("Connection opened");
		}
	
		socket.onmessage = function(event) {
	
			console.log("Received message. Clearing chat.");
	
			chat.innerHTML = "";
	
			console.log("Parsing JSON Data: ", event.data);
	
			const data = JSON.parse(event.data);
			console.log("Iterating over messages.");
			for(var rawmessage of data)
			{
				let message = JSON.parse(rawmessage);
				
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
				alert("You must insert a message!")
				return;
			}
			var message = JSON.stringify({
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

	connectbutton.click();
};


