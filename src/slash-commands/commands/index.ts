import { ApplicationCommandType, CommandInteraction } from "discord.js";
import { DiscordClient, SlashCommandModule, SlashCommands } from "../../types";

const filterUnique = (commands: SlashCommands) => {
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

const replyCommands = async (
    interaction: CommandInteraction,
    client: DiscordClient
) => {
    await interaction.deferReply({ ephemeral: true });
    try {
        const commands = filterUnique(client.slashCommands);
        const embed = {
            title: "Available commands:",
            fields: commands.map((command) => ({
                name: Array.isArray(command.data.name)
                    ? command.data.name.join(", ")
                    : command.data.name,
                value: command.data.description,
            })),
        };
        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        await interaction.editReply("Something went wrong with the command");
        console.log(error);
    }
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["commands", "help", "tasukete"],
        description: "Lists all commands",
    },
    async execute(interaction: CommandInteraction, client: DiscordClient) {
        await replyCommands(interaction, client);
    },
};

export default command;
