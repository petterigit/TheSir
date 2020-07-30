"use strict";
/* DON'T TOUCH MAIN, TYPE IMPORT AND MAIN FUNC TO MAIN.JS
 */

/* require */
require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const token = process.env.TOKEN;

/* Scripts */
const nextMeme = require("./scripts/nextmeme/main.js");
const voiceChannel = require("./scripts/voicechannel/main.js");
const poke = require("./scripts/poke/main.js");
const commands = require("./scripts/commands/main.js");
const niiloTweets = require("./scripts/niiloTweet/main.js");
const userTweets = require("./scripts/userTweets/main.js");
const story = require("./scripts/story/main.js");
const pop = require("./scripts/pop/main.js");
const baptise = require("./scripts/baptise/main.js");
const praise = require("./scripts/praise/main.js");
const askShrek = require("./scripts/askShrek/main.js");
const play = require("./scripts/play/main.js");

/* stuff */
const prefix = "sir ";

/* Bot setup */
client.on("ready", () => {
  console.log("I am ready");
  client.user.setActivity("Fucking", { type: "my sister" });
});

/* Message routes */
client.on("message", (message) => {
  if (!message.content.startsWith(prefix)) return;
  let args = message.content.substring(1).split(" ");
  let cmd = args[1];

  args = args.splice(1);

  console.log("message.channel.type", message.channel.type);
  if (message.channel.type === "dm") {
    if (cmd === "alias") {
      play.aliasDM(message);
    }
    return;
  }

  // For alias game
  if (message.channel.name.toLowerCase() === "alias") {
    if (cmd !== "play") {
      play.aliasCommand(message);
      return;
    }
  }

  switch (cmd) {
    case "ping":
      message.channel.send("Pong!");
      play.startGame(message);
      break;
    case "help":
      message.channel.send(
        "For commands type 'sir commands'\nrepo: https://github.com/petterigit/TheSir"
      );
      break;
    case "apua":
      message.channel.send(
        "For commands type 'sir commands'\nrepo: https://github.com/petterigit/TheSir"
      );
      break;
    case "meme":
      nextMeme.getMeme(message);
      break;
    case "join":
      voiceChannel.startVoice(message);
      break;
    case "poke":
      poke.poke(message);
      break;
    case "commands":
      commands.replyCommands(message);
      break;
    case "niilo22":
      niiloTweets.getNiiloTweet(message);
      break;
    case "twit":
      userTweets.getUserTweet(message);
      break;
    case "story":
      story.beginStory(message);
      break;
    case "pop":
      pop.pop(message);
      break;
    case "bap":
      baptise.startBaptise(message);
      break;
    case "praise":
      praise.praise(message);
      break;
    case "shame":
      praise.praise(message, true);
      break;
    case "ask":
      askShrek.askShrek(message);
      break;
    case "play":
      play.startGame(message, client);
      break;
    //	case 'messsage_X':
    //  break;
    default:
      message.channel.send("Mikä oli?");
  }
});

client.login(token);
