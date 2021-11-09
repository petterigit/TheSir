import { Message } from "discord.js";
import { Commands, DiscordClient } from "../../types";

const filterUnique = (commands: Commands) => {
    return commands.reduce((uniqueCommands, command) => {
        if (
            !uniqueCommands.find(
                (uniqueCommand) => uniqueCommand.execute === command.execute
            )
        ) {
            uniqueCommands.push(command);
        }
        return uniqueCommands;
    }, []);
};

const replyCommands = async (message: Message, client: DiscordClient) => {
    try {
        const commands = filterUnique(client.commands);
        const embed = {
            title: "Available commands:",
            fields: commands.map((command) => ({
                name: Array.isArray(command.data.name)
                    ? command.data.name.join(", ")
                    : command.data.name,
                value: command.data.description,
            })),
        };
        message.channel.send({ embeds: [embed] });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    data: {
        name: ["commands", "help", "tasukete", "助けて"],
        description: "Lists all commands",
    },
    async execute(message: Message, client: DiscordClient) {
        await replyCommands(message, client);
    },
};
