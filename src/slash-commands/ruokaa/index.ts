import axios from "axios";
import { CommandInteraction, MessageActionRow, MessageEmbed } from "discord.js";
import {
    ApplicationCommandTypes,
    MessageButtonStyles,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createButton, randomColor } from "../../util";
import { getConfig } from "../ruokaa-config";
import { DayChangeHourUtc, Restaurant, RestaurantButtons } from "./consts";

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
    lutBuffet?: Category[];
};

const keskusta = (): Category => ({
    category: "Lounas",
    foods: [
        {
            name: "Ruokaa",
            dietInfo: ["Syötävää"],
        },
    ],
});

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const weekday = getWeekday();
    const config = await getConfig();
    const foods = config[weekday];

    try {
        let data: JsonResponse | undefined = undefined;

        if (
            foods.includes(Restaurant.yolo) ||
            foods.includes(Restaurant.laseri) ||
            foods.includes(Restaurant.lutBuffet)
        ) {
            try {
                const response = await axios(
                    "https://skinfo.juho.space/categories.json"
                );
                data = await response.data;
            } catch (error) {
                console.error("Fetch failed", error);
                data = undefined;
            }
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
        const addButton = (restaurant: keyof typeof RestaurantButtons) => {
            buttonRow.addComponents(
                createButton(
                    generateButtonId(restaurant),
                    RestaurantButtons[restaurant]
                )
            );
        };

        foods.map((food) => {
            switch (food) {
                case Restaurant.yolo:
                    if (!data?.yolo?.length) return;
                    appendMenu(data.yolo, "Yololla:");
                    addButton("yolo");
                    break;
                case Restaurant.laseri:
                    if (!data?.laseri?.length) return;
                    appendMenu(data.laseri, "Laserilla:");
                    addButton("laseri");
                    break;
                case Restaurant.lutBuffet:
                    if (!data?.lutBuffet?.length) return;
                    appendMenu(data.lutBuffet, "LUT Buffetissa:");
                    addButton("lutBuffet");
                    break;
                case Restaurant.keskusta:
                    appendMenu([keskusta()], "Keskustassa:");
                    addButton("keskusta");
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
                    RestaurantButtons.skip,
                    MessageButtonStyles.SECONDARY
                )
            );
        }

        await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
        });
    } catch (error) {
        interaction.editReply("Ei ruokalistoja.");
        console.log(error);
    }
};

const getWeekday = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    let day = date.getUTCDay();
    if (hour >= DayChangeHourUtc) day++;
    if (day === 7) day = 0;
    return day;
};

const generateButtonId = (restaurant: keyof typeof RestaurantButtons) =>
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
