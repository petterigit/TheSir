"use strict";
/* IMPORT const poke = require('./scripts/poke/main.js');
/* MAIN poke(message)
 */


/* TODO
 * encode message for ��kk�set
 * get nickname for guild
 */

exports.poke = async (message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message.channel.send(`HERÄTYS ${message.member}, senkin vätys!`);
        }
    }
    catch (error) {
        console.log(error)
    }

}
