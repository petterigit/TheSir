import {
    ColorResolvable,
    Message,
    MessageActionRow,
    MessageEmbed,
} from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

import fetch from "node-fetch";
import { createButton, randomColor } from "../../util";

type Food = {
    name: string;
    dietInfo: string[];
};

type Category = {
    category: string;
    foods: Food[];
};

type JSONResponse = {
    laseri?: Category[];
    yolo?: Category[];
};

const ruokaa = async (message: Message) => {
    message.channel.sendTyping();

    try {
        const response = await fetch(
            "https://skinfo.juho.space/categories.json"
        );
        const data: JSONResponse = await response.json();

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
            await message.channel.send({
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

        await message.channel.send({
            embeds: [embed],
            components: [buttonRow],
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    data: {
        name: ["ruokaa"],
        description: "Daily lunch planner",
    },
    async execute(message: Message) {
        await ruokaa(message);
    },
};
