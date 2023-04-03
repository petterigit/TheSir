import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
} from "discord.js";

const options: ApplicationCommandOptionData[] = [
    {
        name: "clip",
        description: "plays a clip from given options",
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
            {
                name: "heinix",
                description: "Just six - Heinix",
                type: ApplicationCommandOptionType.Subcommand,
            },
            {
                name: "kala",
                description: "Kala ihastuttaa ja vihastuttaa <3",
                type: ApplicationCommandOptionType.Subcommand,
            },
        ],
    },
    {
        name: "youtube",
        description: "give url and sir shall play",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: "link",
                description: "youtube link (https://www.youtube...)",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ],
    },
];

export default options;
