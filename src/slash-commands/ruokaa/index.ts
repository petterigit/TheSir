import axios from "axios";
import { CommandInteraction, MessageActionRow, MessageEmbed } from "discord.js";
import {
    ApplicationCommandTypes,
    MessageButtonStyles,
} from "discord.js/typings/enums";
import { Restaurant } from "../../interactions/ruokaa";
import { SlashCommandModule } from "../../types";
import { createButton, randomColor } from "../../util";

const DayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

const FoodConfig = {
    [DayMap.Monday]: [Restaurant.yolo, Restaurant.laseri],
    [DayMap.Tuesday]: [Restaurant.yolo, Restaurant.laseri],
    [DayMap.Wednesday]: [Restaurant.yolo, Restaurant.laseri],
    [DayMap.Thursday]: [Restaurant.yolo, Restaurant.laseri, Restaurant.tang],
    [DayMap.Friday]: [Restaurant.yolo, Restaurant.laseri, Restaurant.lalo],
    [DayMap.Saturday]: [Restaurant.yolo, Restaurant.laseri],
    [DayMap.Sunday]: [Restaurant.yolo, Restaurant.laseri],
};

type Food = {
    name: string;
    dietInfo: string[];
};

type Category = {
    category: string;
    foods: Food[];
};

type JsonResponse = {
    laseri?: Category[];
    yolo?: Category[];
};

const tang = (): Category => ({
    category: "Buffet",
    foods: [
        {
            name: "Sushia",
            dietInfo: ["Kalaa"],
        },
        {
            name: "Wokkia",
            dietInfo: [],
        },
    ],
});

const lalo = (): Category => ({
    category: "Lounas",
    foods: [
        {
            name: "Börgeri",
            dietInfo: ["Rasvaa"],
        },
        {
            name: "Salaatti",
            dietInfo: ["Terveellinen"],
        },
    ],
});

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const weekday = getWeekday();
    const foods = FoodConfig[weekday];

    try {
        let data: JsonResponse | undefined = undefined;

        if (
            foods.includes(Restaurant.yolo) ||
            foods.includes(Restaurant.laseri)
        ) {
            const response = await axios(
                "https://skinfo.juho.space/categories.json"
            );
            data = await response.data;
        }

        const embed = new MessageEmbed();
        embed.setTitle("Syödään tänään");
        embed.setColor(randomColor());

        const appendMenu = (categories: Category[], header: string) => {
            const textMenu = [];
            for (const category of categories) {
                textMenu.push(` - ${category.category}:`);
                for (const food of category.foods) {
                    let result = `   ${food.name}`;
                    if (food.dietInfo.length > 0) {
                        result += ` (${food.dietInfo.join("/")})`;
                    }
                    textMenu.push(result);
                }
            }
            embed.addField(header, textMenu.join("\n"), true);
            embed.setTimestamp();
        };

        const buttonRow = new MessageActionRow();
        const addButton = (restaurant: keyof typeof Restaurant) => {
            buttonRow.addComponents(
                createButton(
                    generateButtonId(restaurant),
                    Restaurant[restaurant]
                )
            );
        };

        foods.map((food) => {
            switch (food) {
                case Restaurant.yolo:
                    if (!data.yolo || data.yolo.length === 0) return;
                    appendMenu(data.yolo, "Yololla:");
                    addButton("yolo");
                    break;
                case Restaurant.laseri:
                    if (!data.laseri || data.laseri.length === 0) return;
                    appendMenu(data.laseri, "Laserilla:");
                    addButton("laseri");
                    break;
                case Restaurant.tang:
                    appendMenu([tang()], "Tang Capitalissa:");
                    addButton("tang");
                    break;
                case Restaurant.lalo:
                    appendMenu([lalo()], "Lalossa:");
                    addButton("lalo");
                    break;
            }
        });

        if (buttonRow.components.length === 0) {
            await interaction.editReply({
                content: "Ei ruokalistoja.",
            });

            return;
        }

        if (buttonRow.components.length > 0) {
            buttonRow.addComponents(
                createButton(
                    generateButtonId("skip"),
                    Restaurant.skip,
                    MessageButtonStyles.SECONDARY
                )
            );
        }

        await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
        });
    } catch (error) {
        console.log(error);
    }
};

const getWeekday = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    let day = date.getUTCDay();
    if (hour >= 16) day++;
    return day;
};

const generateButtonId = (restaurant: keyof typeof Restaurant) =>
    `ruokaa ${restaurant}`;

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["ruokaa"],
        description: "Daily lunch planner",
    },
    async execute(message: CommandInteraction) {
        await ruokaa(message);
    },
};

export default command;
