let chat, uname, msg, /*ip, */ ucolor, msgcolor, txtcolor, connectbutton, dcbutton, userlist, socket, pinger;

window.onload = () =>
{
	const HOST = location.origin.replace(/^http/, 'ws');

	//ip = document.querySelector("#ip");
	chat = document.querySelector("#chat");
	uname = document.querySelector("#name");
	msg = document.querySelector("#msg");
	ucolor = document.querySelector("#namecolor");
	msgcolor = document.querySelector("#messagecolor");
	txtcolor = document.querySelector("#txtcolor");
	userlist = document.querySelector("#onlinelist");

	connectbutton = document.querySelector("#connect");
	dcbutton = document.querySelector("#disconnect");

	if (uname.value.length >= 3)
		connectbutton.removeAttribute("disabled");

	uname.oninput = () =>
	{
		if (uname.value.length >= 3)
			connectbutton.removeAttribute("disabled");
		else
			connectbutton.setAttribute("disabled", "");
	}

	connectbutton.onclick = () =>
	{
		if (socket) return;
		chat.innerHTML = "";
		console.log(HOST);
		socket = new WebSocket(HOST);

		dcbutton.onclick = () =>
		{
			if (!socket) return;
			clearInterval(pinger);
			console.log("Disconnecting");
			socket.send(JSON.stringify({
				"type": "exit",
				"user": uname.value,
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
			}));
			chat.innerHTML = "";
			onlinelist.innerHTML = "";
			socket.close();
			socket = null;
		}

		socket.onopen = function (event)
		{
			console.log("Connection opened.");
			socket.send(JSON.stringify({
				"type": "login",
				"user": uname.value,
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
			}));
			console.log("Beginning pings...");
			pinger = setInterval(() =>
			{
				socket.send(JSON.stringify({
					"type": "ping",
					"user": uname.value,
					"usercolor": ucolor.value,
					"msgcolor": msgcolor.value,
				}));
			}, 10000);
		};

		socket.onmessage = function (event)
		{
			console.log("Parsing incoming JSON Data: ", event.data);
			const data = JSON.parse(event.data);
			const firstMessage = data[0] || data;
			switch (firstMessage.type)
			{
				case "message":
					//Chat Packet
					console.log("Received message. Clearing chat.");

					let scrollToBottom = chat.scrollTop == chat.scrollTopMax;

					chat.innerHTML = "";

					console.log("Iterating over messages. ");

					for (var message of data)
					{
						console.log("Message sender: ", message.user);
						console.log("Message contents: ", message.msg);
						console.log("Colors: " + message.usercolor + "," + message.msgcolor + "," + message.txtcolor);

						let timestamp = document.createElement("span");
						let chatmsg = document.createElement("span");
						let chatmsgname = document.createElement("b");

						timestamp.appendChild(document.createTextNode(`${message.time} `));
						chatmsgname.appendChild(document.createTextNode(`${message.user}: `));

						let chatmsgcontent = document.createTextNode(message.msg);
						timestamp.style.fontSize = "0.8em";
						timestamp.style.color = calculateColor(message.msgcolor) ? "#00000099" : "#FFFFFF99";
						chatmsgname.style.color = message.usercolor;
						chatmsg.style.color = message.txtcolor;
						chatmsg.style.backgroundColor = message.msgcolor;

						chatmsg.appendChild(timestamp);
						chatmsg.appendChild(chatmsgname);
						chatmsg.appendChild(chatmsgcontent);
						chat.appendChild(chatmsg);
					}
					if (scrollToBottom) chat.scrollTop = chat.scrollTopMax;
					break;

				case "login":
				case "exit":
				case "ping":
					console.log(data[0].type == "ping" ? "Ping received." :
						data[0].type == "login" ? "New user connection received. Clearing user list." :
							"Disconnected user. Clearing user list.");

					onlinelist.innerHTML = "";

					console.log("Iterating over online users.");
					for (var user of data)
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

		document.querySelector("#send").addEventListener("click", () =>
		{
			//Error catching
			if (uname.value.length < 3)
			{
				alert("You need a username of 3 chars minimum!");
				return;
			}
			if (msg.value.trim().length < 1)
			{
				return;
			}
			var message = JSON.stringify({
				"type": "message",
				"user": uname.value,
				"msg": msg.value,
				"time": new Date().toLocaleTimeString(navigator.language, { hour12: false, hour: '2-digit', minute: '2-digit' }),
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
				"txtcolor": txtcolor.value
			});
			console.log("Sending: ", message);
			socket.send(message);
			msg.value = "";
			msg.focus();
		});

		msg.addEventListener("keyup", event =>
		{
			if (event.keyCode === 13)
			{
				event.preventDefault();
				document.querySelector("#send").click();
			}
		});
	};
};

window.onbeforeunload = () =>
{
	//send disconnection to clients
	console.log("Window unloading.. Sending")
	if (socket)
	{
		socket.send(JSON.stringify({
			"type": "exit",
			"user": uname.value,
			"usercolor": ucolor.value,
			"msgcolor": msgcolor.value,
		}));
	}
};


function validateHex(color)
{
	if(color.startsWith("#")) {
		color = color.slice(1);
	}
	if(color.length === 3) {
		color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
	}
	if(color.length !== 6 || color.match(/[g-z]/)) {
		throw new Error("Invalid hex");
	}

	return color;
}

function getRGB(color)
{
	let r = Number(`0x${color[0] + color[1]}`),
		g = Number(`0x${color[2] + color[3]}`),
		b = Number(`0x${color[4] + color[5]}`);

	return {r:r,g:g,b:b};
}

function calculateColor(color)
{
	color = validateHex(color);

	let rgb = getRGB(color);

	return ((rgb.r+rgb.g+rgb.b)/3)>100;
}
