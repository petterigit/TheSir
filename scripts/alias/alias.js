const NUMBER_OF_WORDS_TO_SELECT_FROM = 3;

module.exports = class Alias {
  constructor(client, message) {
    // Alias voice channel id and bot client.
    this.channelID = "738082273580154880";
    this.client = client;
    this.messageChannel = message.channel;

    this.players = [];
    this.fullPlayerList = [];
    this.currentPlayerIndex = 0;

    // Get words from json?
    this.words = ["auto", "ohjelmoija", "Uolevi"];
    this.chosenWord = null;
  }

  async startGame(message) {
    // Get players.
    const channel = await this.client.channels.resolve(this.channelID);
    const users = channel.members.array();
    this.fullPlayerList = users;
    users.forEach((user) => {
      this.players.push({ id: user.id, name: user.nickname, points: 0 });
    });
    // Test data
    /*
    this.players = [
      {
        id: "107787176116240384",
        name: "Vilps, the Shameful Koala",
        points: 0,
      },
      {
        id: "114761696697909252",
        name: "ユホ, the Elder Kavu Nephilim",
        points: 0,
      },
      {
        id: "228946022628327426",
        name: "meh, the meh of meh",
        points: 0,
      },
      {
        id: "262529578889641984",
        name: "S i s k o, the Egg Horror",
        points: 0,
      },
    ];
    */

    let namesMessage = "Pelaajat ovat:\n";
    console.log(this.players);
    this.players.forEach((player) => {
      console.log(player);
      namesMessage += " ";
      namesMessage += player.name;
      namesMessage += "\n";
    });

    message.channel.send(namesMessage);
    this.chooseWord();
  }

  chooseWord() {
    //const player = this.fullPlayerList[this.currentPlayerIndex];
    const player = this.fullPlayerList[3];

    let message = player.nickname;
    message += " valitsee sanaa...";
    this.messageChannel.send(message);
    const wordList = this.getSelectableWords();
    let wordMessage = "Valitse sana (vastaa: 'sir alias <numero>'):\n";
    for (let i = 0, len = wordList.length; i < len; i++) {
      wordMessage += i + 1;
      wordMessage += ") ";
      wordMessage += wordList[i];
      wordMessage += "\n";
    }
    player.send(wordMessage);
  }

  getSelectableWords() {
    // Redo this with the json
    return this.words;
  }

  setSelectedWord(message) {
    let args = message.content.substring(1).split(" ");
    if (message.author.id !== this.fullPlayerList[3].user.id) {
      message.channel.send("Ei ole sinun vuorosi valita sanaa!");
      return;
    }
    if (args[1] === "alias" && !isNaN(args[2])) {
      const chosenNumber = parseInt(args[2]);
      if (chosenNumber > NUMBER_OF_WORDS_TO_SELECT_FROM - 1) {
        message.channel.send(
          "Sanaa ei voitu valita.\nVastauksen tulee olla muodossa 'sir alias <numero>' eli esim 'sir alias 69'\nYritä uudelleen."
        );
      } else {
        this.chosenWord = this.words[args[2]] - 1;
        console.log("this.chosenWord", this.chosenWord);
      }
    } else {
      message.channel.send(
        "Sanaa ei voitu valita.\nVastauksen tulee olla muodossa 'sir alias <numero>' eli esim 'sir alias 69'\nYritä uudelleen."
      );
    }
  }
};
