import sample from "lodash/sample";
import random from "lodash/random";
import {
    launchPuppeteer,
    navigateToPage,
} from "../../utils/ruokaa-utils/puppeteerUtils";

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
    const browser = await launchPuppeteer();

    const page = await browser.newPage();
    await navigateToPage(
        page,
        `https://www.memedroid.com/memes/getGallerySurroundings/${timestamp}`
    );

    await page.content();

    const json: JsonResponse = await page.evaluate(() => {
        return JSON.parse(document.querySelector("body").innerText);
    });

    await browser.close();

    if (!json) {
        throw new Error("Puppeteer failed to get json.");
    }

    if (json.stat != 0) {
        throw new Error("Status was not 0. Status: " + json.stat);
    }

    const length = json.items.length;
    if (length <= 0) {
        throw new Error("No memes were fetched");
    }

    const selectedMeme = sample(json.items);
    return selectedMeme;
};

// Makes a timestamp in Memedroid url format (10 chars long)
const randomTimestamp = (start: Date, end: Date) => {
    const ranNumber = random(start.getTime(), end.getTime());
    return ranNumber.toString().substring(0, 10);
};
