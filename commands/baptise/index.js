"use strict";

/* Shamelessly copied most code from
https://bitbucket.org/nikugronberg/toripolliisi/src/master/scripts/baptise.js
*/

/* IMPORT const baptise = require('./scripts/baptise/main.js');
/* MAIN startBaptise(message);
 */

let axios = require("axios");

const TITLEURL = "https://proksi.juho.space/pet-name";
const nicknameLength = 32;

const startBaptise = (message) => {
  if (message.mentions.users.first() != null) {
    let newName = "";
    let title = "";
    let member = message.mentions.members.first();
    let memberName = member.displayName;
    message.channel
      .send(
        memberName +
          " has lived a sinful life and will be baptised in the Saimaa to become one with the God again",
        { code: true }
      )

      //create nickname and change it
      .then((msg) => {
        // Get user name
        newName += memberName;
        if (newName.includes(",")) {
          newName = newName.slice(0, newName.indexOf(","));
        }

        // Get title from api
        axios.post(TITLEURL, {}).then(
          (response) => {
            title = response.data;
            newName += ", the " + title;

            // Make sure it's not too long
            newName = newName.substring(0, nicknameLength);

            // Set name
            member
              .setNickname(newName)
              .then(() => {
                msg.edit(
                  msg.toString().replace(/`/g, "") +
                    "\n\nYou are now reborn as: " +
                    newName,
                  { code: true }
                );
              })
              .catch((err) => {
                console.log("baptising went wrong:\n" + err);
                msg.edit(
                  msg.toString().replace(/`/g, "") +
                    "\n\nHe drowned in the Oulujoki",
                  { code: true }
                );
              });
          },
          (error) => {
            console.log(error);
          }
        );
      })
      //on error abort
      .catch((err) => {
        console.log(err);
      });
  }
};

module.exports = {
  data: {
    name: ["bap", "baptise", "baptize"],
    description: "Give people a new and unique nickname",
  },
  async execute(message) {
    await startBaptise(message);
  },
};
