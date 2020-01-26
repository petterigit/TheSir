"use strict";

/* require */
require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

/* Scripts */
const nextMeme = require('./scripts/nextmeme/main.js');

/* stuff */
const prefix = "sir ";


client.on('ready', () => {
    console.log("I am ready");
    client.user.setActivity('Fucking', {type: 'my sister'});
});


/* Message routes */
client.on('message', message => {
	if (!message.content.startsWith(prefix)) return;
	
	let args = message.content.substring(1).split(' ');
	let cmd = args[1];
   
	args = args.splice(1);
	switch(cmd) {
		// ping!
		case 'ping':
			message.channel.send("Pong!");
			break;
		// pong!
		case 'pong':
			message.channel.send("Ping!");
			break;
		case 'help':
			message.channel.send("https://github.com/petterigit/TheSir");
			break;
		case 'meme':
			nextMeme.getMeme(message);
	//	case 'messsage_X':
		break;
	 }
  });

client.login(token);