import { Message } from "discord.js";

const poke = async (message: Message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message
                .delete()
                .then((msg) =>
                    msg.channel.send(`HERÄTYS ${user.username}, senkin vätys!`)
                )
                .catch(console.error);
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    data: {
        name: ["poke"],
        description: "Poke your friends and family!",
    },
    async execute(message: Message) {
        await poke(message);
    },
};
