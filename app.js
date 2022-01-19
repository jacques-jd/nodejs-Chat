let chat, uname, msg, ip, ucolor, msgcolor, txtcolor, connectbutton, userlist, socket;
window.onload = () => {
	ip = document.querySelector("#ip");
	chat = document.querySelector("#chat");
	uname = document.querySelector("#name");
	msg = document.querySelector("#msg");
	ucolor = document.querySelector("#namecolor");
	msgcolor = document.querySelector("#messagecolor");
	txtcolor = document.querySelector("#txtcolor");
	userlist = document.querySelector("#onlinelist");

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
		if (socket) return;
		socket = new WebSocket(`ws://${ip.value}:8080`);
		
		socket.onopen = function(event) {
			console.log("Connection opened");
			socket.send(JSON.stringify({
				"type": "login",
				"user": uname.value,
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
			}));
		};

		socket.onclose = function(event) {
			socket.send(JSON.stringify({
				"type": "exit",
				"user": uname.value,
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
			}));
		};
	
		socket.onmessage = function(event) {
			console.log("Parsing incoming JSON Data: ", event.data);
			const data = JSON.parse(event.data);
			switch(data[0].type) 
			{
			case "message":
				//Chat Packet
				console.log("Received message. Clearing chat.");
	
				chat.innerHTML = "";

				console.log("Iterating over messages. ");
				for(var message of data)
				{
					console.log("Message sender: ", message.user);
					console.log("Message contents: ", message.msg);
					console.log("Colors: " + message.usercolor + "," + message.msgcolor + "," + message.txtcolor);
		
					let chatmsg = document.createElement("span");
					let chatmsgname = document.createElement("b");
					
					chatmsgname.appendChild(document.createTextNode(`${message.user}: `));
					
					let chatmsgcontent = document.createTextNode(message.msg);
		
					chatmsgname.style.color = message.usercolor;
					chatmsg.style.color = message.txtcolor;
					chatmsg.style.backgroundColor = message.msgcolor;
		
					chatmsg.appendChild(chatmsgname);
					chatmsg.appendChild(chatmsgcontent);
					chat.appendChild(chatmsg);
				}
			break;

			case "login":
			case "exit":
				console.log(data[0].type == "login" ? "New user connection received. Clearing user list." : "Disconnected user. Clearing user list.");

				onlinelist.innerHTML = "";

				console.log("Iterating over online users.");
				for(var user of data)
				{
					console.log("User: ", user.user);
					console.log("Color: " + user.usercolor);

					let listedUser = document.createElement("span");
					let listedUserName = document.createTextNode(`${user.user}`);

					listedUser.appendChild(listedUserName);

					listedUser.style.color = user.usercolor;
					listedUser.style.backgroundColor = user.msgcolor;

					userlist.appendChild(listedUser);
				}
			break;
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

window.onbeforeunload = () => {
	//send disconnection to clients
	console.log("Window unloading.. Sending")
	if(socket){
		socket.send(JSON.stringify({
			"type": "exit",
			"user": uname.value,
			"usercolor": ucolor.value,
			"msgcolor": msgcolor.value,
		}));
	}
};