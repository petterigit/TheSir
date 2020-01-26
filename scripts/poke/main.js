"use strict";

/* TODO 
 * encode message for ääkköset
 * get nickname for guild 
 */

exports.poke = async (message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message.reply(`HERÄTYS ${user.username}, senkin vätys!`);
        }
    }
    catch (error) {
        console.log(error)
    }

}
