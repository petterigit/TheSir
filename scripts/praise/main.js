const Praise = require("./praise.js");
const Discord = require("discord.js");

/* IMPORT const Praise = require('./scripts/praise/main.js');
/* MAIN praise(message, shameInstead);
 */
praise = async (message, shameInstead = false) => {
    const mentions = message.mentions;

    if(mentions.users.size != 0 || mentions.everyone) {
        let buffer = null;
        try {
            buffer = await Praise.generatePraise(shameInstead);
        } catch (error) {
            message.channel.send("Praise machine is broken");
            console.log(error);
            return;
        }

        const attachment = new Discord.MessageAttachment(buffer, "reaction.jpg")

        let text = "";
        const sender = message.author.username;
        if(mentions.everyone) {
            if(shameInstead) {
                text = `${sender} shames everyone!`;
            } else {
                text = `${sender} praises everyone!`;
            }
        } else {
            let users = `${mentions.users.map((value, key) => value.username).toString().replace(",", ", ")}`
            let index = users.lastIndexOf(",")
            if(index > 0) {
                users = `${users.substring(0, index)} and ${users.substring(index + 1)}`;
            }
            if(shameInstead) {
                text = `${sender} shames ${users}!`;
            } else {
                text = `${sender} praises ${users}!`;
            }
        }
        
        try {
            message.channel.send(text, attachment);
        } catch(error) {
            console.log("Failed to send message from praise main.js");
        }
    }

    else {
        try {
            message.channel.send("You need to @ someone");
        } catch(error) {
            console.log("Failed to send message from praise main.js");
        }
    }
}

exports.praise = praise;