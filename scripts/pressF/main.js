"use strict";


exports.f = async (message) => {

    const user = message.member.nickname;
    //console.log(user);

    let msg = "targetName has paid their respects".replace("targetName", user);

    message.channel.send(msg);

}