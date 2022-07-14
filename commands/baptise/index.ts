import { Message } from "discord.js";

/* Shamelessly copied most code from
https://bitbucket.org/nikugronberg/toripolliisi/src/master/scripts/baptise.js
*/

import axios from "axios";
import sample from "lodash/sample";

const TITLEURL = "https://proksi.juho.space/pet-name";
const MAX_NAME_LENGTH = 32;

const createPetName = async (memberName: string) => {
    try {
        const response = await axios(TITLEURL);
        const data = await response.data;
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
        let memberName = member.displayName;
        memberName = memberName.split(",")[0];
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
                        console.error("baptising went wrong:\n");
                        console.error(err);
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
