/* IMPORT const kortteja = require('./scripts/kortteja/main.js');
/* MAIN kortteja(message)
 */

const fetch = require("node-fetch");

const cardGameUrl = "http://pelit.space";
const newGamePath = "/g";

exports.kortteja = async (message) => {
  const url = `${cardGameUrl}${newGamePath}`;
  try {
    const response = await fetch(url, { method: "POST" });
    const json = await response.json();

    const embed = {
      title: "Kortit ihmiskuntaa vastaan",
      url: `${cardGameUrl}${newGamePath}/${json.url}`,
      description: `Tule (tirsk) pelaamaan kortteja ihmiskuntaa vastaan!
      Peli: ${json.url}
      `,
    };

    message.channel.send({ embed: embed });
  } catch (e) {
    message.channel.send(`Korttipelin aloittaminen ei onnistunut :((`);
  }
};
