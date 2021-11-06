const fetch = require("node-fetch");
import _ = require("lodash");

const startingDate = new Date(2012, 1, 1);

exports.nextMeme = async () => {
    const timestamp = randomTimestamp(startingDate, new Date());
    const res = await fetch(
        "https://www.memedroid.com/memes/getGallerySurroundings/" + timestamp
    );
    const json = await res.json();

    if (json.stat != 0) {
        throw new Error("Status was not 0. Status: " + json.stat);
    }

    const length = json.items.length;
    if (length <= 0) {
        throw new Error("No memes were fetched");
    }
    return json.items[_.random(0, length - 1)];
};

// Makes a timestamp in Memedroid url format (10 chars long)
const randomTimestamp = (start: Date, end: Date) => {
    const ranNumber = _.random(start.getTime(), end.getTime());
    return ranNumber.toString().substr(0, 10);
};
