/* require */
require("dotenv").config();
const { intents } = require("./intents.js");
const Discord = require("discord.js");
const client = new Discord.Client({ intents: intents });
const token = process.env.TOKEN;
const fs = require("fs");

/* Scripts */
const nextMeme = require("./scripts/nextmeme/index.js");
const voiceChannel = require("./scripts/voicechannel/index.js");
const poke = require("./scripts/poke/index.js");
const commands = require("./scripts/commands/index.js");
const niiloTweets = require("./scripts/niiloTweet/index.js");
const userTweets = require("./scripts/userTweets/index.js");
const story = require("./scripts/story/index.js");
const pop = require("./scripts/pop/index.js");
const baptise = require("./scripts/baptise/index.js");
const praise = require("./scripts/praise/index.js");
const askShrek = require("./scripts/askShrek/index.js");
const ruokaa = require("./scripts/ruokaa/index.js");
const noppa = require("./scripts/noppa/index.js");
const amongUs = require("./scripts/amongUs/index.js");
const f = require("./scripts/pressF/index.js");
const wholesome = require("./scripts/wholesome/index.js");
const fiiliskierros = require("./scripts/fiiliskierros/index.js");
const kortteja = require("./scripts/kortteja/index.js");

/* stuff */
const prefix = "sir ";

/* Bot setup */
client.once("ready", () => {
  console.log("I am ready");
  client.user.setActivity("Fucking", { type: "my sister" });
});

/* Require all commands from the scripts folder */
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./scripts/");
for (const dir of commandFiles) {
  const command = require(`./scripts/${dir}`);
  if (command?.data?.name) {
    client.commands.set(command.data.name, command);
  }
}

/* Handle messages */
client.on("messageCreate", async (message) => {
  if (!message.content.startsWith(prefix)) return;
  let args = message.content.substring(1).split(" ");
  let cmd = args[1];

  args = args.splice(1);

  const command = client.commands.get(cmd);
  if (!command) return;
  try {
    await command.execute(message);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }

  return;
  switch (cmd) {
    case "ping":
      message.channel.send("Pong!");
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
    case "ruokaa":
      ruokaa.ruokaa(message);
      break;
    case "noppa":
      noppa.noppa(message);
      break;
    case "sus":
      amongUs.sus(message);
      break;
    case "f":
      f.f(message);
      break;
    case "F":
      f.f(message);
      break;
    case "wholesome":
      wholesome.wholesome(message);
      break;
    case "fiilikset":
      fiiliskierros.fiiliskierros(message);
      break;
    case "kortteja":
      kortteja.kortteja(message);
      break;
    //	case 'messsage_X':
    //  break;
    default:
      message.channel.send("Mikä oli?");
  }
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isButton()) return;
  if (interaction.customId == "aa") {
    console.log("maaa");
  }
});

client.login(token);
