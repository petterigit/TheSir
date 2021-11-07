/* eslint-disable semi */
/* eslint-disable quotes */
"use strict";

import { Message } from "discord.js";

const pop = async (message: Message) => {
    try {
        let pops = "\u2800\n";
        const seis = "<:seis:690617911748067368>";
        const args = message.content.substring(1).split(" ");
        const amount = Number.parseInt(args[2]);
        if (amount > 0 && amount <= 14) {
            for (let i = 0; i < amount; i++) {
                for (let i = 0; i < amount; i++) {
                    pops = pops + "||pop!||";
                }
                pops = pops + "\n";
            }
        } else if (amount > 14) {
            pops = seis + " nyt oli liian thiccc, max pop on 14.";
        } else {
            pops = "||pop!||";
        }
        message.channel.send(pops);
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    data: {
        name: ["pop"],
        description: "Virtual bubblewrap",
    },
    async execute(message: Message) {
        await pop(message);
    },
};
