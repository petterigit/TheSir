"use strict";


exports.doubt = async (message) => {

    const user = message.member.nickname;
    //console.log(user);

    let msg = "targetName has pressed X to doubt that. ".replace("targetName", user);

    message.channel.send(msg);

}