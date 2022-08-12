import axios from "axios";
import { CommandInteraction, MessageActionRow, MessageEmbed } from "discord.js";
import {
    ApplicationCommandTypes,
    MessageButtonStyles,
} from "discord.js/typings/enums";
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

const foodConfig = {
    [DayMap.Monday]: ["yolo", "laseri"],
    [DayMap.Tuesday]: ["yolo", "laseri"],
    [DayMap.Wednesday]: ["yolo", "laseri"],
    [DayMap.Thursday]: ["yolo", "laseri", "tang"],
    [DayMap.Friday]: ["yolo", "laseri", "lalo"],
    [DayMap.Saturday]: ["yolo", "laseri"],
    [DayMap.Sunday]: ["yolo", "laseri"],
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
    const foods = foodConfig[weekday];

    try {
        let data: JsonResponse | undefined = undefined;

        if (foods.includes("yolo") || foods.includes("laseri")) {
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

        foods.map((food) => {
            switch (food) {
                case "yolo":
                    if (!data.yolo || data.yolo.length === 0) return;
                    appendMenu(data.yolo, "Yololla:");
                    buttonRow.addComponents(
                        createButton("ruokaa yolo", "Yolo")
                    );
                    break;
                case "laseri":
                    if (!data.laseri || data.laseri.length === 0) return;
                    appendMenu(data.laseri, "Laserilla:");
                    buttonRow.addComponents(
                        createButton("ruokaa laser", "Laser")
                    );
                    break;
                case "tang":
                    appendMenu([tang()], "Tang Capitalissa:");
                    buttonRow.addComponents(
                        createButton("ruokaa tang", "Tang Capital")
                    );
                    break;
                case "lalo":
                    appendMenu([lalo()], "Lalossa:");
                    buttonRow.addComponents(
                        createButton("ruokaa lalo", "Lalo")
                    );
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
                    "ruokaa skip",
                    "Skip",
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
