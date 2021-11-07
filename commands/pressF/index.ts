"use strict";

import { Message } from "discord.js";
import { getNicknameOrName } from "../../util";

const f = async (message: Message) => {
    const user = getNicknameOrName(message);
    const msg = "targetName has paid their respects".replace(
        "targetName",
        user
    );

    await message.channel.send(msg);
    return;
};

module.exports = {
    data: {
        name: ["F"],
        description: "F in the chat bois",
    },
    async execute(message: Message) {
        await f(message);
    },
};
