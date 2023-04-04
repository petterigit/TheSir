import sample from "lodash/sample";
import random from "lodash/random";

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

import T from "../../utils/TwitterClient";
import {
    ApplicationCommandOptionData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommandModule } from "../../types";

const MAX_TWEETS = 100;

const path = "statuses/user_timeline";
const parameters = {
    screen_name: "niilo222",
    count: MAX_TWEETS,
    tweet_mode: "extended",
};

const inputs: ApplicationCommandOptionData[] = [
    {
        type: ApplicationCommandOptionType.String,
        name: "animal",
        description: "Choose your wholesome content",
        required: false,
        choices: animalsFIN.map((animal) => ({ name: animal, value: animal })),
    },
];

const wholesome = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    try {
        let chosen = 0;
        const param = interaction.options.getString("animal");
        if (param && !animalsFIN.includes(param)) {
            console.log(param, animalsFIN);
            interaction.editReply("Invalid animal");
            return;
        }

        if (param == "kani") {
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
            chosen = random(0, WHS_Cats.length);
            parameters.screen_name = WHS_Cats[chosen];
        } else if (param == "koira") {
            chosen = random(0, WHS_Dogs.length);
            parameters.screen_name = WHS_Dogs[chosen];
        } else if (param == "video") {
            parameters.screen_name = WHS_twitters[8];
            chosen = 7;
        }
        // Add else if's when adding new animals
        // *********************
        else {
            chosen = random(0, WHS_twitters.length);
            parameters.screen_name = WHS_twitters[chosen];
        }
        getTweetsAndSendOneToDiscord(interaction, chosen);
        return;
    } catch (error) {
        interaction.editReply("Vituiks meni ku Jeesuksen pääsiäinen!");
        console.log(error);
        return;
    }
};

function getTweetsAndSendOneToDiscord(
    interaction: ChatInputCommandInteraction,
    chosen: number
) {
    if (!T) {
        interaction.editReply("No Twitter client");
        return;
    }

    T.get(path, parameters, function (err, data) {
        if (err) {
            interaction.editReply("Twitter API failure");
            console.log("Requested:", "Received error from Twitter API:", err);
            return;
        }
        let animal = 0;
        let tweetStatus = -1;
        let media_video_url = "";
        let video_url_temp = "";
        let tweet_text = "";
        let tweet_text_temp = 0;
        while (tweetStatus == -1) {
            const tweet: any = sample(data);

            let answerMessage = {};
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

                    if (
                        tweet.entities.media[0].media_url.search("video") != -1
                    ) {
                        video_url_temp =
                            tweet.entities.media[0].media_url_https.split("/");
                        //console.log(video_url_temp);
                        video_url_temp = video_url_temp[
                            video_url_temp.length - 1
                        ].replace("jpg", "mp4");
                        media_video_url =
                            "https://video.twimg.com/tweet_video/" +
                            video_url_temp;

                        tweet_text_temp =
                            tweet.full_text.search("https://t.co");
                        tweet_text = tweet.full_text.slice(0, tweet_text_temp);

                        //console.log(media_video_url);
                        answerMessage = {
                            description:
                                "Tässä sinulle video:\n\n" + tweet_text,
                        };
                        tweetStatus = 0;
                    } else {
                        answerMessage = {
                            description:
                                "Tässä sinulle " + animalsFIN[animal] + ":\n\n",
                            image: { url: tweet.entities.media[0].media_url },
                        };
                        tweetStatus = 0;
                    }
                } else {
                    continue;
                }
            }
            interaction.editReply({ embeds: [answerMessage] });
            if (media_video_url != "") {
                interaction.editReply(media_video_url);
            }
        }
    });
}

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["wholesome"],
        description: "Wholesome content machine",
        options: inputs,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await wholesome(interaction);
    },
};

export default command;
