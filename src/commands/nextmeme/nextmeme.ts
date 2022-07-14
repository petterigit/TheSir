import sample from "lodash/sample";
import random from "lodash/random";
import axios from "axios";

const startingDate = new Date(2012, 1, 1);

type Meme = {
    ID?: number;
    type?: number;
    title?: string;
    tags?: string;
    url?: string;
    timestamp?: number;
    votes?: number;
    positiveVotes?: number;
    uploaderName?: string;
    uploaderID?: number;
    rating?: number;
    width?: number;
    height?: number;
    thumbnailURL?: string;
    titleToSlug?: string;
};

type JsonResponse = {
    stat: number;
    items: Meme[];
};

export const nextMeme = async (): Promise<Meme> => {
    const timestamp = randomTimestamp(startingDate, new Date());
    const res = await axios(
        "https://www.memedroid.com/memes/getGallerySurroundings/" + timestamp
    );
    const json: JsonResponse = await res.data;

    if (json.stat != 0) {
        throw new Error("Status was not 0. Status: " + json.stat);
    }

    const length = json.items.length;
    if (length <= 0) {
        throw new Error("No memes were fetched");
    }
    return sample(json.items);
};

// Makes a timestamp in Memedroid url format (10 chars long)
const randomTimestamp = (start: Date, end: Date) => {
    const ranNumber = random(start.getTime(), end.getTime());
    return ranNumber.toString().substr(0, 10);
};
