"use strict";

// *****************
// Add wholesome twitter @'s here

const WHS_twitters = ["RabbitEveryHour", "UnsolicitedDiks", "hourlyFox", "PossumEveryHour", "RaccoonEveryHr", "ShouldHaveCat"];

// Add the animals here
const animalsFIN = ["kani", "dikdik (eli kärsäantilooppi)", "kettu", "opossumi", "pesukarhu", "kissa"];

// *****************

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
  count: MAX_TWEETS,
  tweet_mode: "extended"
};

exports.wholesome = async (message) => {

    try {

        let chosen = 0;
        let args = message.content.substring(1).split(" ");
        let param = args[2];

        if (param == "help") {
            let animalsString = "";
            for (let i = 0;i<animalsFIN.length;i++) {
                animalsString += (animalsFIN[i] + "\n");
            }
            const help = {
                description: "Saatavilla olevat eläimet:\n\n" + animalsString  
            };
            message.channel.send({ embed: help })
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
            parameters.screen_name = WHS_twitters[5];
            chosen = 5;
        }

        // Add else if's when adding new animals
        // *********************

        else {
            chosen = randomNumber(0, WHS_twitters.length)
            parameters.screen_name = WHS_twitters[chosen];
        }
        getTweetsAndSendOneToDiscord(message, chosen);      
    } catch (error) {
        message.channel.send("Vituiks meni ku Jeesuksen pääsiäinen!");
        console.log(error);
    }

}

function getTweetsAndSendOneToDiscord(message, chosen) {

        T.get(path, parameters, function(err, data, response) {

            let tweetStatus = -1;
            while (tweetStatus == -1) {
                const tweet = data[randomNumber(0, MAX_TWEETS)];

                let answerMessage = ""
                if (typeof tweet === "undefined") {
                    continue;
                    
                } else {
                    if (tweet.entities.media) {
                        answerMessage = {
                            description:
                            "Tässä sinulle " +
                            animalsFIN[chosen] +
                            ":\n\n",
                            image: { url: tweet.entities.media[0].media_url }
                        };
                        tweetStatus = 0;
                    } else {
                        continue;
                    }
                }
                message.channel.send({ embed: answerMessage });
            }         
  });

}

const randomNumber = (start, end) => {
  return Math.floor(Math.random() * (start - end + 1)) + end;
};
