"use strict";
/* IMPORT const ruokaa = require('./scripts/ruokaa/main.js');
/* MAIN ruokaa() */

exports.ruokaa = async (message) => {
    try {
          const mes = await message.channel.send(`
Syödään tänään
🍉 Yololla
🍑 Laserilla
`)
          mes.react("🍉");
          mes.react("🍑");
        }
    catch (error) {
        console.log(error)
    }

}
