"use strict";

import { Message } from "discord.js";

const { getNicknameOrName } = require("../../util");

const f = async (message: Message) => {
    const user = getNicknameOrName(message);
    const msg = "targetName has paid their respects".replace(
        "targetName",
        user
    );

    message.channel.send(msg);
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
