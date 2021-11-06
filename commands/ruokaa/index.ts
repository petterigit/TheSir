"use strict";

import { ExcludeEnum, Message, MessageButton } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";

const fetch = require("node-fetch");
const Discord = require("discord.js");
import { createButton, randomColor } from "../../util";

const ruokaa = async (message: Message) => {
    message.channel.sendTyping();

    try {
        const menu = await fetch(
            "https://skinfo.juho.space/categories.json"
        ).then((res) => res.json());

        const embed = new Discord.MessageEmbed();
        embed.setTitle("Syödään tänään");
        embed.setColor(randomColor());

        const appendMenu = (categories, header) => {
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

        const yolo = menu.yolo && menu.yolo.length > 0;
        const laseri = menu.laseri && menu.laseri.length > 0;

        const buttonRow = new Discord.MessageActionRow();

        if (!yolo && !laseri) {
            await message.channel.send({
                content: "Ei ruokalistoja.",
            });

            return;
        }

        if (laseri) {
            appendMenu(menu.laseri, "Laserilla:");
            buttonRow.addComponents(createButton("ruokaa laser", "Laser"));
        }

        if (yolo) {
            appendMenu(menu.yolo, "Yololla:");
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
