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
    //const year = randomNumber(2012, 2020);
    const year = "2015";

    T.get(path, parameters, function(err, data, response) {
      const tweet = getRandomTweet(data);
      sendTweetToDiscord(tweet, message);
    });
  } catch (error) {
    message.channel.send("Vituiks meni!");
    console.log(error);
  }
};

function getRandomTweet(tweets) {
  return tweets[randomNumber(0, MAX_TWEETS)];
}

const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (start - end + 1)) + end;
};

function sendTweetToDiscord(tweet, message) {
  const embed = createAnswerMessage(tweet);
  message.channel.send({ embed: embed });
}

function createAnswerMessage(tweet) {
  let answerMessage = {
    description:
      "Niilo22 twiittasi " + parseDate(tweet.created_at) + ":\n\n" + tweet.text
  };
  return answerMessage;
}

function parseDate(date) {
  let parsedDate = "";
  const weekday = date.slice(0, 3);
  const month = date.slice(4, 7);
  const day = date.slice(8, 10);
  const time = date.slice(11, 16);
  const year = date.slice(26, 30);

  parsedDate =
    parseWeekday(weekday) +
    " " +
    parseDay(day) +
    " " +
    parseMonth(month) +
    " " +
    year +
    " klo " +
    time;

  return parsedDate;
}

function parseWeekday(weekday) {
  let parsedWeekday = "";
  const weekdaysEng = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weekdaysFin = [
    "maanantaina",
    "tiistaina",
    "keskiviikkona",
    "torstaina",
    "perjantaina",
    "lauantaina",
    "sunnuntaina"
  ];

  for (let i = 0; i < 7; i++) {
    if (weekday == weekdaysEng[i]) {
      parsedWeekday = weekdaysFin[i];
      break;
    }
  }

  return parsedWeekday;
}

function parseMonth(month) {
  let parsedMonth = "";
  const monthsEng = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  const monthsFin = [
    "tammikuuta",
    "helmikuuta",
    "maaliskuuta",
    "huhtikuuta",
    "toukokuuta",
    "kesäkuuta",
    "heinäkuuta",
    "elokuuta",
    "syyskuuta",
    "lokakuuta",
    "marraskuuta",
    "joulukuuta"
  ];

  for (let i = 0; i < 12; i++) {
    if (month == monthsEng[i]) {
      parsedMonth = monthsFin[i];
      break;
    }
  }

  return parsedMonth;
}

function parseDay(day) {
  let parsedDay = "";

  if (day.slice(0, 1) == "0") {
    parsedDay = day.slice(1, 2) + ".";
  } else {
    parsedDay = day + ".";
  }

  return parsedDay;
}

// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=twitterapi&count=2
// GET https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=niilo222&tweet_mode=extended&exclude_replies=true
