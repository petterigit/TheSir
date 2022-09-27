import {
    ApplicationCommandOptionData,
    CommandInteraction,
    MessageEmbed,
} from "discord.js";
import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import {
    ConfigFileName,
    DayMap,
    DefaultFoodConfig,
    FoodConfig,
    Restaurant,
} from "../ruokaa/consts";
import { readFile, writeFile } from "fs/promises";
import { getObjectKey } from "../../util";

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: "operation",
        description: "What to do?",
        required: true,
        choices: [
            { name: "Add", value: "add" },
            { name: "Remove", value: "remove" },
            { name: "List", value: "list" },
        ],
    },
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: "day",
        description: "Day to configure",
        required: false,
        choices: Object.entries(DayMap).map(([name, value]) => ({
            name,
            value: value.toString(),
        })),
    },
    {
        type: ApplicationCommandOptionTypes.STRING,
        name: "restaurant",
        description: "Restaurant",
        required: false,
        choices: Object.values(Restaurant).map((value) => ({
            name: value,
            value,
        })),
    },
];

const config = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const foodConfig = await getConfig();
    const operation = interaction.options.getString("operation");

    if (operation === "list") {
        await sendConfig(interaction, foodConfig);
        return;
    }

    const dayString = interaction.options.getString("day");
    const restaurant = interaction.options.getString("restaurant");

    if (!dayString || !restaurant) {
        await interaction.editReply({ content: "Anna päivä ja ravintola" });
        return;
    }

    const day = parseInt(dayString);
    const handler = { add: handleAdd, remove: handleRemove }[operation];
    const newConfig = handler(foodConfig, day, restaurant);
    try {
        saveConfig(newConfig);
        await interaction.editReply(
            `Päivitetty ${getObjectKey(DayMap, day)}: ${newConfig[day].join(
                ", "
            )}`
        );
    } catch (e) {
        await interaction.editReply("Muutosten tallentaminen epäonnistui");
    }
};

export const getConfig = async (): Promise<FoodConfig> => {
    try {
        const file = await readFile(ConfigFileName);
        const parsed: FoodConfig = JSON.parse(file.toString());
        return parsed;
    } catch (e) {
        return DefaultFoodConfig;
    }
};

export const saveConfig = async (config: FoodConfig) => {
    await writeFile(ConfigFileName, JSON.stringify(config));
};

const handleAdd = (config: FoodConfig, day: number, restaurant: string) => {
    const dayContainsValue = config[day].includes(restaurant);
    if (!dayContainsValue) {
        config[day].push(restaurant);
    }
    return config;
};

const handleRemove = (config: FoodConfig, day: number, restaurant: string) => {
    const dayContainsValue = config[day].includes(restaurant);
    if (dayContainsValue) {
        config[day] = config[day].filter((value) => value !== restaurant);
    }
    return config;
};

const sendConfig = async (
    interaction: CommandInteraction,
    config: FoodConfig
) => {
    const embed = new MessageEmbed();
    embed.setTitle("Ruokalistan asetukset");
    Object.entries(config).map(([day, restaurants]) =>
        embed.addField(
            getObjectKey(DayMap, parseInt(day)),
            restaurants.join(", ") || "*Tyhjä*",
            false
        )
    );
    await interaction.editReply({ embeds: [embed] });
};

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["configure-ruokaa"],
        description: "Daily lunch planner configuration tool",
        options: inputs,
    },
    async execute(message: CommandInteraction) {
        await config(message);
    },
};

export default command;
