"use strict";

// *****************
// Add wholesome twitter @'s here

const WHS_twitters = [
  "RabbitEveryHour",
  "UnsolicitedDiks",
  "hourlyFox",
  "PossumEveryHour",
  "RaccoonEveryHr",
  "ShouldHaveCat",
  "DogSolutions",
  "dog_rates",
  "cutefunnyanimal",
  "contextkittens",
  "catsdotexe",
  "contextdogs",
];

const WHS_Cats = ["ShouldHaveCat", "contextkittens", "catsdotexe"];
const WHS_Dogs = ["DogSolutions", "dog_rates", "contextdogs"];

// Add the animals here
const animalsFIN = [
  "kani",
  "dikdik (eli kärsäantilooppi)",
  "kettu",
  "opossumi",
  "pesukarhu",
  "kissa",
  "koira",
  "video",
];

// *****************

const Twit = require("twit");

const TWITTERTOKEN_consumer_key = process.env.TWITTERTOKEN_consumer_key;
const TWITTERTOKEN_consumer_secret = process.env.TWITTERTOKEN_consumer_secret;
const TWITTERTOKEN_access_token = process.env.TWITTERTOKEN_access_token;
const TWITTERTOKEN_access_token_secret =
  process.env.TWITTERTOKEN_access_token_secret;

let T = undefined;
try {
  T = new Twit({
    consumer_key: TWITTERTOKEN_consumer_key,
    consumer_secret: TWITTERTOKEN_consumer_secret,
    access_token: TWITTERTOKEN_access_token,
    access_token_secret: TWITTERTOKEN_access_token_secret,
  });
} catch (e) {
  console.log("Could not initialize Twit");
}

const MAX_TWEETS = 100;

const path = "statuses/user_timeline";
const parameters = {
  screen_name: "niilo222",
  count: MAX_TWEETS,
  tweet_mode: "extended",
};

exports.wholesome = async (message) => {
  try {
    let chosen = 0;
    let args = message.content.substring(1).split(" ");
    let param = args[2];

    if (param == "help") {
      let animalsString = "";
      for (let i = 0; i < animalsFIN.length; i++) {
        animalsString += animalsFIN[i] + "\n";
      }
      const help = {
        description: "Saatavilla olevat eläimet:\n\n" + animalsString,
      };
      message.channel.send({ embed: help });
      return;
    } else if (param == "kani") {
      parameters.screen_name = WHS_twitters[0];
      chosen = 0;
    } else if (param == "dikdik") {
      parameters.screen_name = WHS_twitters[1];
      chosen = 1;
    } else if (param == "kettu") {
      parameters.screen_name = WHS_twitters[2];
      chosen = 2;
    } else if (param == "opossumi") {
      parameters.screen_name = WHS_twitters[3];
      chosen = 3;
    } else if (param == "pesukarhu") {
      parameters.screen_name = WHS_twitters[4];
      chosen = 4;
    } else if (param == "kissa") {
      chosen = randomNumber(0, WHS_Cats.length);
      parameters.screen_name = WHS_Cats[chosen];
    } else if (param == "koira") {
      chosen = randomNumber(0, WHS_Dogs.length);
      parameters.screen_name = WHS_Dogs[chosen];
    } else if (param == "video") {
      parameters.screen_name = WHS_twitters[8];
      chosen = 7;
    }

    // Add else if's when adding new animals
    // *********************
    else {
      chosen = randomNumber(0, WHS_twitters.length);
      parameters.screen_name = WHS_twitters[chosen];
    }
    getTweetsAndSendOneToDiscord(message, chosen);
  } catch (error) {
    message.channel.send("Vituiks meni ku Jeesuksen pääsiäinen!");
    console.log(error);
  }
};

function getTweetsAndSendOneToDiscord(message, chosen) {
  if (!T) return;

  T.get(path, parameters, function (err, data, response) {
    if (data.error) {
      console.log(
        "Requested:",
        data.request,
        "Received error from Twitter API:",
        data.error
      );
      return;
    }
    let animal = 0;
    let tweetStatus = -1;
    let media_video_url = "";
    let video_url_temp = "";
    let tweet_text = "";
    let tweet_text_temp = 0;
    while (tweetStatus == -1) {
      const tweet = data[randomNumber(0, MAX_TWEETS)];

      let answerMessage = "";
      if (typeof tweet === "undefined") {
        continue;
      } else {
        if (tweet.entities.media) {
          //Dog
          if (chosen == 6 || chosen == 7 || chosen == 11) {
            animal = 6;
          } else if (chosen == 9 || chosen == 10 || chosen == 5) {
            //Cat
            animal = 5;
          } else {
            animal = chosen;
          }

          if (tweet.entities.media[0].media_url.search("video") != -1) {
            video_url_temp = tweet.entities.media[0].media_url_https.split("/");
            //console.log(video_url_temp);
            video_url_temp = video_url_temp[video_url_temp.length - 1].replace(
              "jpg",
              "mp4"
            );
            media_video_url =
              "https://video.twimg.com/tweet_video/" + video_url_temp;

            tweet_text_temp = tweet.full_text.search("https://t.co");
            tweet_text = tweet.full_text.slice(0, tweet_text_temp);

            //console.log(media_video_url);
            answerMessage = {
              description: "Tässä sinulle video:\n\n" + tweet_text,
            };
            tweetStatus = 0;
          } else {
            answerMessage = {
              description: "Tässä sinulle " + animalsFIN[animal] + ":\n\n",
              image: { url: tweet.entities.media[0].media_url },
            };
            tweetStatus = 0;
          }
        } else {
          continue;
        }
      }
      message.channel.send({ embed: answerMessage });
      if (media_video_url != "") {
        message.channel.send(media_video_url);
      }
    }
  });
}

const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (start - end + 1)) + end;
};
