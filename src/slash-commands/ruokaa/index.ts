import axios from "axios";
import { CommandInteraction, MessageActionRow, MessageEmbed } from "discord.js";
import {
    ApplicationCommandTypes,
    MessageButtonStyles,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";

import { createButton, randomColor } from "../../util";

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

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    try {
        const response = await axios(
            "https://skinfo.juho.space/categories.json"
        );
        const data: JsonResponse = await response.data;

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

        const yolo = data.yolo && data.yolo.length > 0;
        const laseri = data.laseri && data.laseri.length > 0;

        const buttonRow = new MessageActionRow();

        if (!yolo && !laseri) {
            await interaction.editReply({
                content: "Ei ruokalistoja.",
            });

            return;
        }

        if (laseri) {
            appendMenu(data.laseri, "Laserilla:");
            buttonRow.addComponents(createButton("ruokaa laser", "Laser"));
        }

        if (yolo) {
            appendMenu(data.yolo, "Yololla:");
            buttonRow.addComponents(createButton("ruokaa yolo", "Yolo"));
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
