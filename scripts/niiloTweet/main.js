"use strict";

const fetch = require("node-fetch");

exports.getNiiloTweet = async message => {
  try {
    const res = await getTweet();
    const date = new Date(res.timestamp);
    let embed;
    if (res.url) {
      embed = {
        description: `Tweeted: ${date.getDate()}.${date.getMonth() +
          1}.${date.getFullYear()}`
      };
    } else {
      embed = {
        image: { url: res.url },
        description: `Tweeted: ${date.getDate()}.${date.getMonth() +
          1}.${date.getFullYear()}`
      };
    }
    const mes = await message.channel.send({ embed: embed });
  } catch (error) {
    message.channel.send("Vituiks meni!");
    console.log(error);
  }
};

const getTweet = async () => {
  const response = await fetch(
    "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=niilo222"
  );
  const tweets = await response.json();
  console.log("Found tweets:", tweets);
  const length = json.items.length;
  if (length <= 0) {
    throw new Error("No tweets were fetched");
  }
  return json.items[randomNumber(0, length - 1)];
};

// Both ends inclusive
const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (start - end + 1)) + end;
};

// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2
// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=niilo222
