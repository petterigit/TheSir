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
    namesMessage += "\n\n";

    message.channel.send(namesMessage);
    this.chooseWord();
  }

  chooseWord() {
    const player = this.fullPlayerList[this.currentPlayerIndex];

    let message = player.nickname;
    message += " valitsee sanaa...";
    this.messageChannel.send(message);
    player.send("homo");
  }
};
