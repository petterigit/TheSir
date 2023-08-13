import { Browser, Page, ScreenshotClip } from "puppeteer";
import {
    getNextEnglishDayShort,
    getWeekday,
} from "../../../utils/ruokaa-utils/generalUtils";
import {
    navigateToPage,
    clickButton,
    screenShot,
} from "../../../utils/ruokaa-utils/puppeteerUtils";
import { ssNames } from "../consts";
const PageWidth = 800;
const PageHeight = 2000;

export const getLutBuffetClip = async (browser: Browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width: PageWidth, height: PageHeight });

    await navigateToPage(
        page,
        "https://fi.jamix.cloud/apps/menu/?anro=97383&k=1&mt=4"
    );

    await clickButton(page, getNextEnglishDayShort(getWeekday()), "span");

    const clip = await lutBuffetClip(page);
    if (clip) {
        await screenShot(page, clip, ssNames.lutBuffet.fileLoc);
    }
};

const lutBuffetClip = async (page: Page): Promise<ScreenshotClip | null> => {
    console.info("Get lut buffet clip size");

    try {
        const sizes = await page.evaluate(() => {
            const topImg = document.getElementsByTagName("img")[0];

            const spans = Array.from(document.getElementsByTagName("span"));
            let end;
            for (let i = 0; i < spans.length; i++) {
                const el = spans[i];

                if (el.innerText.includes("Ruokavaliot")) {
                    end = el.getBoundingClientRect().top;
                    break;
                }
            }

            if (!end) {
                throw new Error(
                    `Could not find an end point for lut buffet clip at ${document.URL}`
                );
            }

            return { start: topImg.offsetHeight, end: end };
        });

        return {
            height: sizes.end - sizes.start,
            width: PageWidth,
            x: 0,
            y: sizes.start,
        };
    } catch (error) {
        console.info(error);
        return null;
    }
};
