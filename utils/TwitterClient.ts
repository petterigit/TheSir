import Twit = require("twit");

const placeholderKey = "-";

const TWITTERTOKEN_consumer_key = process.env.TWITTERTOKEN_consumer_key;
const TWITTERTOKEN_consumer_secret = process.env.TWITTERTOKEN_consumer_secret;
const TWITTERTOKEN_access_token = process.env.TWITTERTOKEN_access_token;
const TWITTERTOKEN_access_token_secret =
    process.env.TWITTERTOKEN_access_token_secret;

if (!TWITTERTOKEN_consumer_key) console.warn("Missing twitter consumer key");
if (!TWITTERTOKEN_consumer_secret)
    console.warn("Missing twitter consumer secret");
if (!TWITTERTOKEN_access_token) console.warn("Missing twitter access token");
if (!TWITTERTOKEN_access_token_secret)
    console.warn("Missing twitter access token secret");

const T = new Twit({
    consumer_key: TWITTERTOKEN_consumer_key ?? placeholderKey,
    consumer_secret: TWITTERTOKEN_consumer_secret ?? placeholderKey,
    access_token: TWITTERTOKEN_access_token ?? placeholderKey,
    access_token_secret: TWITTERTOKEN_access_token_secret ?? placeholderKey,
});

export default T;
