"use strict";

/* require */
require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

/* Scripts */
const nextMeme = require('./scripts/nextmeme/main.js');
const voiceChannel = require('./scripts/voicechannel/main.js');

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
		case 'ping':
			message.channel.send("Pong!");
			break;
		case 'pong':
			message.channel.send("Ping!");
			break;
		case 'help':
			message.channel.send("https://github.com/petterigit/TheSir");
			break;
		case 'meme':
			nextMeme.getMeme(message);
			break;
		case 'join':
			voiceChannel.startVoice(message);
			break;
	//	case 'messsage_X':
		break;
	 }
  });

client.login(token);