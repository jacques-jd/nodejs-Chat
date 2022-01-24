let chat, uname, msg, /*ip, */ ucolor, msgcolor, txtcolor, connectbutton, dcbutton, userlist, socket, theme, pinger;

window.onload = () => {
	const HOST = location.origin.replace(/^http/, 'ws');

	//ip = document.querySelector("#ip");
	chat = document.querySelector("#chat");
	uname = document.querySelector("#name");
	msg = document.querySelector("#msg");
	ucolor = document.querySelector("#namecolor");
	msgcolor = document.querySelector("#messagecolor");
	txtcolor = document.querySelector("#txtcolor");
	userlist = document.querySelector("#onlinelist");
	theme= {
		bgSel: document.querySelector("#col1"),
		fgSel: document.querySelector("#col2"),
		col1Sel: document.querySelector("#col3"),
		col2Sel: document.querySelector("#col4"),
		theme1: document.querySelector("#theme1"),
		theme2: document.querySelector("#theme2"),
		theme3: document.querySelector("#theme3"),
		preset1: {
			bg:'#F4DFD0',
			fg:'#FDEFEF',
			col1:'#fff8f8',
			col2:'#ffeaea',
		},
		preset2: {
			bg:'#C9CCD5',
			fg:'#FFE3E3',
			col1:'#E4D8DC',
			col2:'#93B5C6',
		},
		preset3: {
			bg:'#BAABDA',
			fg:'#FFF9F9',
			col1:'#D6E5FA',
			col2:'#D77FA1',
		},
	};

	theme.preset1.link = "#"+darkenColor(theme.preset1.bg,50);
	theme.preset2.link = "#"+darkenColor(theme.preset2.bg,50);
	theme.preset3.link = "#"+darkenColor(theme.preset3.bg,50);

	connectbutton = document.querySelector("#connect");
	dcbutton = document.querySelector("#disconnect");

	if(uname.value.length >= 3)
		connectbutton.removeAttribute("disabled");

	theme.bgSel.value = getComputedStyle(document.documentElement).getPropertyValue("--bg");
	theme.fgSel.value = getComputedStyle(document.documentElement).getPropertyValue("--fg");
	theme.col1Sel.value = getComputedStyle(document.documentElement).getPropertyValue("--col1");
	theme.col2Sel.value = getComputedStyle(document.documentElement).getPropertyValue("--col2");

	theme.ogBg = theme.bgSel.value;
	theme.ogFg = theme.fgSel.value;

	let setTheme = colors => {
		if (colors.bg) {
			for(let col in colors) {
				document.documentElement.style.setProperty(`--${col}`, colors[col]);
			}
			return;
		}
		for (let i = 0; i < colors.length; i++) {
			document.documentElement.style.setProperty(`${i<2?i<1?'--bg':'--fg':`--col${i-1}`}`, colors[i]);
		}
		document.documentElement.style.setProperty(`--link`, darkenColor(colors.bg,50));
	}

	theme.bgSel.onchange = theme.fgSel.onchange = theme.col1Sel.onchange = theme.col2Sel.onchange = () => {
		setTheme({bg:theme.bgSel.value, fg:theme.fgSel.value, col1:theme.col1Sel.value, col2:theme.col2Sel.value});
	}

	theme1.onclick = theme2.onclick = theme3.onclick = event => {
		let elem = event.currentTarget;
		if(elem.id == "theme1")
		{
			setTheme(theme.preset1);
		} 
		else if (elem.id == "theme2")
		{
			setTheme(theme.preset2);
		} 
		else 
		{
			setTheme(theme.preset3);
		}
	}

	setTheme(theme.preset1);

	uname.oninput = () => {
		if(uname.value.length >= 3)
			connectbutton.removeAttribute("disabled");
		else
			connectbutton.setAttribute("disabled","");
	}

	connectbutton.onclick = () => {
		if (socket) return;
		chat.innerHTML = "";
		console.log(HOST); 
		socket = new WebSocket(HOST);
		
		dcbutton.onclick = () => {
			if(!socket) return;
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

		socket.onopen = function(event) {
			console.log("Connection opened.");
			socket.send(JSON.stringify({
				"type": "login",
				"user": uname.value,
				"usercolor": ucolor.value,
				"msgcolor": msgcolor.value,
			}));
			console.log("Beginning pings...");
			pinger = setInterval(()=>{
				socket.send(JSON.stringify({
					"type": "ping",
					"user": uname.value,
					"usercolor": ucolor.value,
					"msgcolor": msgcolor.value,
				}));
			},10000);
		};
	
		socket.onmessage = function(event) {
			console.log("Parsing incoming JSON Data: ", event.data);
			const data = JSON.parse(event.data);
			const firstMessage = data[0] || data;
			switch(firstMessage.type) 
			{
			case "message":
				//Chat Packet
				console.log("Received message. Clearing chat.");
				
				let scrollToBottom = chat.scrollTop == chat.scrollTopMax;

				chat.innerHTML = "";

				console.log("Iterating over messages. ");
				
				for(var message of data)
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
				if(scrollToBottom) chat.scrollTop = chat.scrollTopMax;
			break;

			case "login":
			case "exit":
			case "ping":
				console.log(data[0].type == "ping" ? "Ping received." : 
				data[0].type == "login" ? "New user connection received. Clearing user list." : 
				"Disconnected user. Clearing user list.");

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
				"time": new Date().toLocaleTimeString(navigator.language, {hour12:false, hour: '2-digit', minute:'2-digit'}),
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

function darkenColor(color, percent)
{
	if (percent > 1) percent = percent/100;
	color = validateHex(color);
	let rgb = getRGB(color);

	let r = Math.floor(rgb.r * (1 - percent)),
		g = Math.floor(rgb.g * (1 - percent)),
		b = Math.floor(rgb.b * (1 - percent));
	color = r.toString(16) + g.toString(16) + b.toString(16);

	return color;
}
