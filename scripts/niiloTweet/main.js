"use strict";

const Twit = require("twit");

const TWITTERTOKEN_consumer_key = process.env.TWITTERTOKEN_consumer_key;
const TWITTERTOKEN_consumer_secret = process.env.TWITTERTOKEN_consumer_secret;
const TWITTERTOKEN_access_token = process.env.TWITTERTOKEN_access_token;
const TWITTERTOKEN_access_token_secret =
  process.env.TWITTERTOKEN_access_token_secret;

const T = new Twit({
  consumer_key: TWITTERTOKEN_consumer_key,
  consumer_secret: TWITTERTOKEN_consumer_secret,
  access_token: TWITTERTOKEN_access_token,
  access_token_secret: TWITTERTOKEN_access_token_secret
});

const MAX_TWEETS = 100;

const path = "statuses/user_timeline";
const parameters = {
  screen_name: "niilo222",
  count: MAX_TWEETS
};

exports.getNiiloTweet = async message => {
  try {
    T.get(path, parameters, function(err, data, response) {
      const tweet = getRandomTweet(data);
      sendTweetToDiscord(tweet, message);
    });
  } catch (error) {
    message.channel.send("Vituiks meni!");
    console.log(error);
  }
};

function sendTweetToDiscord(tweet, message) {
  const embed = {
    description: "Niilo22 twiittasi " + tweet.created_at + ":\n" + tweet.text
  };
  message.channel.send({ embed: embed });
}

function getRandomTweet(tweets) {
  return tweets[randomNumber(0, MAX_TWEETS)];
}

// Both ends inclusive
const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (start - end + 1)) + end;
};

// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2
// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=niilo222&tweet_mode=extended&exclude_replies=true
