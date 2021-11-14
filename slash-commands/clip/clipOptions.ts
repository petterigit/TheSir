import { ApplicationCommandOptionData } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

const options: ApplicationCommandOptionData[] = [
    {
        name: "kala",
        description: "kalakala",
        type: ApplicationCommandOptionTypes.SUB_COMMAND,
    },
];

export default options;
