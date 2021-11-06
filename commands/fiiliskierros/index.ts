import { Message } from "discord.js";

const fiiliskierros = async (message: Message) => {
    let args = message.content.substring(1).split(" ");
    if (args[2] == "possu") {
        try {
            const member = message.mentions.members.first();
            if (member) {
                message.channel.send(
                    `Possun omistaja on nyt ${member.displayName}, vain hän saa puhua.`
                );
            } else {
                message.channel
                    .send(`Oloni on pettynyt.`)
                    .then(() =>
                        message.channel
                            .send(`Yrittäisit edes.`)
                            .then(() =>
                                message.channel.send(
                                    `sir fiilikset possu @member`
                                )
                            )
                    );
            }
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = {
    data: {
        name: "fiiliskierros",
        description: "Kun on taas aika fiilistellä",
    },
    async execute(message: Message) {
        await fiiliskierros(message);
    },
};
