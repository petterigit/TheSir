import T from "../../utils/TwitterClient";
import sample from "lodash/sample";
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
        name: "name",
        description: "Name of the Twitter user",
        required: true,
    },
];

const getUserTweet = async (interaction: ChatInputCommandInteraction) => {
    await interaction.deferReply();
    try {
        const twitname = interaction.options.getString("name");
        parameters.screen_name = twitname;
        getTweetsAndSendOneToDiscord(interaction);
    } catch (error) {
        interaction.editReply("Something went wrong >_<");
        console.log(error);
    }
};

function getTweetsAndSendOneToDiscord(
    interaction: ChatInputCommandInteraction
) {
    if (!T) {
        interaction.editReply("No Twitter client");
        return;
    }

    T.get(path, parameters, function (err, data) {
        if (err) {
            console.log("Requested:", "Received error from Twitter API:", err);
            interaction.editReply(
                `Probably couldn't find the user by the name: ${parameters.screen_name}`
            );
            return;
        }
        const tweet = getRandomTweet(data);
        sendTweetToDiscord(tweet, interaction);
    });
}

function getRandomTweet(tweets: object) {
    return sample(tweets);
}

function sendTweetToDiscord(
    tweet: any,
    interaction: ChatInputCommandInteraction
) {
    const embed = createAnswerMessage(tweet);
    interaction.editReply({ embeds: [embed] });
}

function createAnswerMessage(tweet: any) {
    let answerMessage = {};
    if (typeof tweet === "undefined") {
        answerMessage = {
            description: "Twiittiä ei löytynyt",
        };
    } else {
        if (tweet.entities.media) {
            answerMessage = {
                description:
                    tweet.user.name +
                    " twiittasi " +
                    parseDate(tweet.created_at) +
                    ":\n\n" +
                    tweet.full_text,
                image: { url: tweet.entities.media[0].media_url },
            };
        } else {
            answerMessage = {
                description:
                    tweet.user.name +
                    " twiittasi " +
                    parseDate(tweet.created_at) +
                    ":\n\n" +
                    tweet.full_text,
            };
        }
    }

    return answerMessage;
}

function parseDate(date: string) {
    const datetime = new Date(date);
    datetime.setHours(datetime.getHours() + 2);

    let parsedDate = "";

    const weekday = datetime.getDay();
    const month = datetime.getMonth();
    const day = datetime.getDate().toString();
    let hour = datetime.getHours().toString();
    if (hour.length < 2) {
        hour = "0" + hour;
    }
    let minute = datetime.getMinutes().toString();
    if (minute.length < 2) {
        minute = "0" + minute;
    }
    const time = hour + ":" + minute;
    const year = datetime.getFullYear().toString();

    parsedDate =
        parseWeekday(weekday) +
        " " +
        parseDay(day) +
        " " +
        parseMonth(month) +
        " " +
        year +
        " klo " +
        parseTime(time);

    return parsedDate;
}

function parseTime(time: string) {
    let parsedTime = "";
    if (time.length < 5) {
        parsedTime = "0" + time;
    } else {
        parsedTime = time;
    }

    return parsedTime;
}

function parseWeekday(weekday: number) {
    let parsedWeekday = "";
    const weekdaysFin = [
        "sunnuntaina",
        "maanantaina",
        "tiistaina",
        "keskiviikkona",
        "torstaina",
        "perjantaina",
        "lauantaina",
    ];

    const NUMBER_OF_WEEKDAYS = 7;
    for (let i = 0; i < NUMBER_OF_WEEKDAYS; i++) {
        if (weekday == i) {
            parsedWeekday = weekdaysFin[i];
            break;
        }
    }

    return parsedWeekday;
}

function parseMonth(month: number) {
    let parsedMonth = "";
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
        "joulukuuta",
    ];

    const NUMBER_OF_MONTHS = 12;
    for (let i = 0; i < NUMBER_OF_MONTHS; i++) {
        if (month == i) {
            parsedMonth = monthsFin[i];
            break;
        }
    }

    return parsedMonth;
}

function parseDay(day: string) {
    let parsedDay = day;
    if (startsWithZero(day)) {
        parsedDay = removeZero(day);
    }
    parsedDay = addDot(parsedDay);
    return parsedDay;
}

function startsWithZero(day: string) {
    if (day.slice(0, 1) == "0") {
        return true;
    } else {
        return false;
    }
}

function removeZero(day: string) {
    return day.slice(1, 2);
}

function addDot(day: string) {
    return day + ".";
}

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandType.ChatInput,
        name: ["tweet"],
        description: "Get a random tweet from any user",
        options: inputs,
    },
    async execute(interaction: ChatInputCommandInteraction) {
        await getUserTweet(interaction);
    },
};

export default command;
