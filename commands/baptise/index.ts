"use strict";

import { Message } from "discord.js";

/* Shamelessly copied most code from
https://bitbucket.org/nikugronberg/toripolliisi/src/master/scripts/baptise.js
*/

/* IMPORT const baptise = require('./scripts/baptise/main.js');
/* MAIN startBaptise(message);
 */
import fetch from "node-fetch";
import sample from "lodash/sample";

const TITLEURL = "https://proksi.juho.space/pet-name";
const MAX_NAME_LENGTH = 32;

const createPetName = async (memberName: string) => {
    try {
        const response = await fetch(TITLEURL);
        const data = await response.json();
        let petName = memberName;
        if (petName.length >= MAX_NAME_LENGTH - 10) {
            return petName;
        } else {
            petName += ", The";
            for (;;) {
                const x = sample(data) as string;
                if (x.length + 1 + petName.length <= MAX_NAME_LENGTH)
                    petName += " " + x;
                else break;
            }
            return petName;
        }
    } catch (error) {
        console.error(error);
    }
};

const startBaptise = async (message: Message) => {
    if (message.mentions.users.first() != null) {
        const member = message.mentions.members.first();
        const memberName = member.displayName;
        message.channel
            .send(
                memberName +
                    " has lived a sinful life and will be baptised in the Saimaa to become one with the God again"
            )
            .then(async (msg) => {
                const newName = await createPetName(memberName);
                member
                    .setNickname(newName)
                    .then(() => {
                        msg.edit(
                            msg.toString().replace(/`/g, "") +
                                "\n\nYou are now reborn as: " +
                                newName
                        );
                    })
                    .catch((err) => {
                        console.error("baptising went wrong:\n" + err);
                        msg.edit(
                            msg.toString().replace(/`/g, "") +
                                "\n\nHe drowned in the Oulujoki"
                        );
                    });
            })
            //on error abort
            .catch((err) => {
                console.error(err);
            });
    }
};

module.exports = {
    data: {
        name: ["bap", "baptise", "baptize"],
        description: "Give people a new and unique nickname",
    },
    async execute(message: Message) {
        await startBaptise(message);
    },
};
