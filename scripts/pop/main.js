"use strict";


exports.pop = async (message) => {
    try {
        let pops = "";
        let seis = message.guild.emojis.find(emoji => emoji.name === "seis");
        let args = message.content.substring(1).split(" ");
        let amount = args[2];
        if (amount > 0 && amount <= 14) {
            for(let i = 0; i < amount; i++) {
                for(let i = 0; i < amount; i++) {
                    pops = pops + "||pop!|| ";
                }
                pops = pops + "\n";
            }
        } else if (amount > 14) {
            pops = seis + " nyt oli liian thiccc, max pop on 14.";
        } else {
            pops = "||pop!||";
        }
        message.channel.send(pops);
    }
    catch (error) {
        console.log(error)
    }

}
