const askShrek = async (message) => {
  try {
    getLinesAndSendOneToDiscord(message);
  } catch (error) {
    message.channel.send("Get out of my Swamp!!\n (Something went wrong...)");
    console.log(error);
  }
};

function getLinesAndSendOneToDiscord(message) {
  let args = message.content.substring(1).split(" ");

  if (args[2]) {
    let characterName = args[2];
    for (i = 3, len = args.length; i < len; i++) {
      characterName = characterName + " " + args[i];
    }
    characterName = characterName.toLowerCase();

    const fs = require("fs");
    const path = require("path");
    const file = fs.readFileSync(path.join(__dirname, "./shrek.json"));
    const allCharacters = JSON.parse(file).speakers;

    let found = false;
    let line = "";
    for (let i = 0, len = allCharacters.length; i < len; i++) {
      if (allCharacters[i].speaker === characterName) {
        found = true;
        line = getRandomLine(allCharacters[i].lines);
        break;
      }
    }

    if (!found) {
      sendCharacterNotFound(message);
    } else {
      sendAnswerToDiscord(line, message);
    }
  } else {
    sendCharacterNotFound(message);
  }
}

function getRandomLine(lines) {
  return lines[randomNumber(0, lines.length)];
}

const randomNumber = (start, end) => {
  return Math.floor(Math.random() * Math.floor(end));
};

function sendCharacterNotFound(message) {
  let embed = "Such a character could not be found to ask...\n";
  embed = embed + "The command should be: 'sir ask <character>'\n";
  embed = embed + "You can ask from these characters:\n";

  const fs = require("fs");
  const path = require("path");
  const file = fs.readFileSync(path.join(__dirname, "./shrek.json"));
  const allCharacters = JSON.parse(file).speakers;

  for (let i = 0, len = allCharacters.length; i < len; i++) {
    if (i === len - 1) {
      embed = embed + allCharacters[i].speaker;
      break;
    }
    embed = embed + allCharacters[i].speaker + ", ";
  }

  message.channel.send({ embeds: [{ description: embed }] });
}

function sendAnswerToDiscord(answer, message) {
  let args = message.content.substring(1).split(" ");
  let characterName = args[2];
  for (i = 3, len = args.length; i < len; i++) {
    characterName = characterName + " " + args[i];
  }
  characterName = characterName.toLowerCase();
  const title =
    characterName.charAt(0).toUpperCase() +
    characterName.slice(1) +
    " answered with:\n";
  message.channel.send({ content: title, embeds: [{ description: answer }] });
}

module.exports = {
  data: {
    name: ["ask", "askShrek"],
    description: "Ask for advice from the most beloved ogre",
  },
  async execute(message) {
    await askShrek(message);
  },
};
