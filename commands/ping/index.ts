import { Message } from "discord.js";

module.exports = {
  data: {
    name: ["ping"],
    description: "Ping!",
  },
  async execute(message: Message) {
    await message.channel.send("Pong!");
  },
};
