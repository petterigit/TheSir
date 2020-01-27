"use strict";

let stories = [];
let starting = false;

//A class for the future, maybe for adding hp or something, I dunno
class Story {
    constructor(message) {
        this.channel = message.channel;
        this.state = 0; //Not even needed right now
    }
}

//Story states
const states = [
    "In front of you see three ways to go.\nWhat do you do?\n1) Go forward\n2) Go right\n3) Go left\n4) Fuck your sister\n5) Kill yourself",
    "You go forward.\n You come to a same kind of crossroad as before.\nWhat is this?\n ---",
    "You go to the right.\nIt's a dead end.\nYou go back.\n ---",
    "You go to the left.\nIt's a dead end.\nYou go back.\n ---",
    "You're fucking your sister!\nShe doesn't say anything and only looks at you with her usual indifferent look.\nJust the way you like it...\n ---",
    "You finally decide this isn't worth it and kill yourself.\nThe story ends.\nYou also left your sister alone. Good job."
]


//Finds a story from the story array
const findStory = (channel) => {
    for(let i = 0; i < stories.length; i++) {
        if(channel == stories[i].channel) {
            return i;
        }
    }
    return -1;
}

exports.beginStory = async (message) => {
    try {
        if(starting) {
            starting = false;
            return;
        } else {
            starting = true;
        }
        if(findStory(message.channel) == -1) {
            message.channel.send("Your story begins.\n ---")
            stories.push(new Story(message));
            message.channel.send(states[0]);
            starting = false;
        } else {
            message.channel.send("A story is already being told.");
        }
    }
    catch (error) {
        console.log(error);
    }

}

//Continues the story
exports.story = async (message) => {
    if(message.content == "story help") {
        message.channel.send("Write the action's number or forward/right/left/hit/kys");
        return;
    }

    let index;
    if((index = findStory(message.channel)) != -1) {
        if(message.content == "story 5" || message.content == "story kys") {
            stories.splice(index, 1);
            message.channel.send(states[5]);
            starting = false;
            return;
        } else if (message.content == "story 1" || message.content == "story forward") {
            message.channel.send(states[1]);
            message.channel.send(states[0]);
        } else if (message.content == "story 2" || message.content == "story right") {
            message.channel.send(states[2]);
            message.channel.send(states[0]);
        } else if (message.content == "story 3" || message.content == "story left") {
            message.channel.send(states[3]);
            message.channel.send(states[0]);
        } else if (message.content == "story 4" || message.content == "story hit") {
            message.channel.send(states[4]);
            message.channel.send(states[0]);
        }
    } else {
        message.channel.send("No story is being told. Begin your story with 'sir story'");
    }
}