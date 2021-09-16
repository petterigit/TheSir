"use strict";
import Twit = require("twit");

const TWITTERTOKEN_consumer_key = process.env.TWITTERTOKEN_consumer_key;
const TWITTERTOKEN_consumer_secret = process.env.TWITTERTOKEN_consumer_secret;
const TWITTERTOKEN_access_token = process.env.TWITTERTOKEN_access_token;
const TWITTERTOKEN_access_token_secret =
    process.env.TWITTERTOKEN_access_token_secret;

const T = new Twit({
    consumer_key: TWITTERTOKEN_consumer_key!,
    consumer_secret: TWITTERTOKEN_consumer_secret!,
    access_token: TWITTERTOKEN_access_token!,
    access_token_secret: TWITTERTOKEN_access_token_secret!,
});

export default T;
