const Discord = require("discord.js");
const fs = require("fs");

exports.getNicknameOrName = (message) => {
    if (message.member.nickname == null) {
        return message.member.user.username;
    }
    return message.member.nickname;
};

exports.createMention = (interaction) => {
    return `<@${interaction.member.id}>`;
};

exports.ButtonTypes = {
    Primary: "PRIMARY",
    Secondary: "SECONDARY",
    Success: "SUCCESS",
    Danger: "DANGER",
    Link: "LINK",
};

exports.randomColor = () => {
    let color = "#";
    for (let i = 0; i < 3; i++) {
        color += Math.floor(Math.random() * 255).toString(16);
    }
    return color;
};

exports.requireCommands = (folderName) => {
    const commands = new Discord.Collection();
    const folders = fs.readdirSync(`./${folderName}/`);

    for (const folder of folders) {
        const command = require(`./${folderName}/${folder}`);
        if (command?.data?.name) {
            if (Array.isArray(command.data.name)) {
                command.data.name.map((name) => commands.set(name, command));
            } else {
                commands.set(command.data.name, command);
            }
        }
    }

    return commands;
};
