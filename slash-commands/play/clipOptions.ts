import { ApplicationCommandOptionData } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

const options: ApplicationCommandOptionData[] = [
    {
        name: "clip",
        description: "plays a clip from given options",
        type: ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
        options: [
            {
                name: "heinix",
                description: "Just six - Heinix",
                type: ApplicationCommandOptionTypes.SUB_COMMAND,
            },
            {
                name: "kala",
                description: "Kala ihastuttaa ja vihastuttaa <3",
                type: ApplicationCommandOptionTypes.SUB_COMMAND,
            },
        ],
    },
    {
        name: "youtube",
        description: "give url and sir shall play",
        type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
];

export default options;
