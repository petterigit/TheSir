"use strict";
/* IMPORT const poke = require('./scripts/poke/main.js');
/* MAIN poke(message)
 */


exports.poke = async (message) => {
    try {
        const user = message.mentions.users.first();
        if (user) {
            user.send("poke :3");
            message.delete()
            .then(message.channel.send(`HERÄTYS ${user.username}, senkin vätys!`))
            .catch(console.log("No rights to delete messages"));
        }
    }
    catch (error) {
        console.log(error)
    }

}
