"use strict";

const Twit = require("twit");

const token = provess.env.TWITTERTOKEN;

const T = new Twit(token);

const path = "statuses/user_timeline";
const parameters = {
  screen_name: "niilo222",
  count: 100
};

exports.getNiiloTweet = async message => {
  try {
    T.get(path, parameters, function(err, data, response) {
      const tweet = getRandomTweet(data);
      sendTweetToDiscord(tweet);
    });
  } catch (error) {
    message.channel.send("Vituiks meni!");
    console.log(error);
  }
};

function sendTweetToDiscord(tweet) {
  const embed = {
    description: "Niilo22 twiittasi " + tweet.created_at + ":\n" + tweet.text
  };
  message.channel.send({ embed: embed });
}

function getRandomTweet(tweets) {
  randomNumber(0, tweets.length);
  return tweets[randomNumber];
}

// Both ends inclusive
const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (start - end + 1)) + end;
};

// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2
// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=niilo222&tweet_mode=extended&exclude_replies=true
