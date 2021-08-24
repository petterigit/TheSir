"use strict";

const { getNicknameOrName } = require("../../util");

const f = async (message) => {
  const user = getNicknameOrName(message);

  let msg = "targetName has paid their respects".replace("targetName", user);

  message.channel.send(msg);
};

module.exports = {
  data: {
    name: ["F"],
    description: "F in the chat bois",
  },
  async execute(message) {
    await f(message);
  },
};
