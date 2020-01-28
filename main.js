"use strict";
/* DON'T TOUCH MAIN, TYPE IMPORT AND MAIN FUNC TO MAIN.JS
 */


/* require */
require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.TOKEN;

/* Scripts */
const nextMeme = require('./scripts/nextmeme/main.js');
const voiceChannel = require('./scripts/voicechannel/main.js');
const poke = require('./scripts/poke/main.js');
const story = require('./scripts/story/main.js')
const commands = require('./scripts/commands/main.js');

/* stuff */
const prefix = "sir ";


/* Bot setup */
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

	switch (cmd) {
		case 'ping':
			message.channel.send("Pong!");
			break;
		case 'help':
			message.channel.send("For commands type 'sir commands'\nrepo: https://github.com/petterigit/TheSir");
			break;
		case 'meme':
			nextMeme.getMeme(message);
			break;
		case 'join':
			voiceChannel.startVoice(message);
			break;
		case 'poke':
			poke.poke(message);
			break;
		case 'story':
			story.beginStory(message);
		case 'commands':
			commands.replyCommands(message);
			break;
	//	case 'messsage_X':
		//  break;
		default:
			message.channel.send("Mik� oli?")
	 }
  });

client.on('message', message => {
	let storyPrefix = "story ";
	if (!message.content.startsWith(storyPrefix)) return;
	if(message.content) {
		story.story(message);
	} else {
		//maybe a varning
	}
})

client.login(token);