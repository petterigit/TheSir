"use strict";


exports.poke = async (message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message.reply(`HERÄTYS ${user.tag}, senkin vätys!`);
        }
    }
    catch (error) {
        console.log(error)
    }

}
