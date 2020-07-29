let gameStorage = {};

const Alias = require("./../alias/alias.js");

exports.startGame = async (message, client) => {
  try {
    let args = message.content.substring(1).split(" ");
    if (args[2]) {
      const gameName = args[2].toLowerCase();
      switch (gameName) {
        case "alias":
          if (message.channel.name.toLowerCase() !== "alias") {
            message.channel.send("Voit pelata aliasta vain alias-kanavalla!");
          } else {
            if (gameStorage.alias) {
              message.channel.send(
                "Peli on jo käynnissä. Voit liittyä mukaan liittymällä alias-puhekanavalle!"
              );
            } else {
              message.channel.send("Aloitetaan peli!");
              gameStorage.alias = new Alias(client, message);
              gameStorage.alias.startGame(message);
            }
          }
          break;
        case "hirsipuu":
          message.channel.send("Hups, kukkulaa hirsipuulle rakennetaan vielä!");
          break;
        default:
          message.channel.send("Sorry, I could not recognize that game.");
          break;
      }
    }
  } catch (error) {
    message.channel.send("Something went wrong.");
    console.log(error);
  }
};

exports.aliasCommand = async (message) => {
  if (gameStorage.alias) {
    let args = message.content.substring(1).split(" ");
    let cmd = args[1];
  } else {
    message.channel.send(
      "Peli ei ollut vielä käynnissä. Kirjoita ```sir play alias``` aloittaaksesi pelin!"
    );
  }
};
