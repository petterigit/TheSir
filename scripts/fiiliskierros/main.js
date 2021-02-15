/* IMPORT const fiiliskierros = require('./scripts/fiiliskierros/main.js');
/* MAIN fiiliskierros(message)
 */


exports.fiiliskierros = async (message) => {

    let args = message.content.substring(1).split(" ");
    if (args[2] == "possu") {
        try {

            const member = message.mentions.members.first();
            if (member) {
                message.channel.send(`Possun omistaja on nyt ${member.displayName}, vain hän saa puhua.`);
            } else {
                message.channel.send(`Oloni on pettynyt.`)
                .then(message.channel.send(`Yrittäisit edes.`))
                .then(message.channel.send(`sir fiilikset possu @member`));
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    

}
