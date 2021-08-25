module.exports = {
  data: {
    name: ["ping"],
    description: "Ping!",
  },
  async execute(message) {
    await message.channel.send("Pong!");
  },
};
