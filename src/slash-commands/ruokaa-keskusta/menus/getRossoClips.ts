import { Browser, Page, ScreenshotClip } from "puppeteer";
import {
    getNextFinnishDay,
    getWeekday,
} from "../../../utils/ruokaa-utils/generalUtils";
import { ssNames } from "../consts";
import {
    navigateToPage,
    screenShot,
} from "../../../utils/ruokaa-utils/puppeteerUtils";

const PageWidth = 1600;
const PageHeight = 2000;

export const getRossoClips = async (browser: Browser) => {
    const page = await browser.newPage();
    await page.setViewport({
        width: PageWidth,
        height: PageHeight,
    });

    await navigateToPage(
        page,
        "https://www.raflaamo.fi/fi/ravintola/lappeenranta/rosso-isokristiina-lappeenranta/menu/lounas"
    );

    const dayClip = await getDayClip(page);
    if (dayClip) {
        await screenShot(page, dayClip, ssNames.rosso.fileLoc);
    }
};

const getDayClip = async (page: Page): Promise<ScreenshotClip | null> => {
    console.info("Get rosso day clip size");

    try {
        const date = getWeekday();
        const finnishDate = getNextFinnishDay(date);

        const sizes = await page.evaluate((tomorrowDate: string) => {
            const headers = Array.from(document.getElementsByTagName("h2"));
            let start;
            let end;
            let width;
            let x;

            for (let i = 0; i < headers.length; i++) {
                const el = headers[i];

                if (el.innerText.includes(tomorrowDate.toUpperCase())) {
                    const rect = el.getBoundingClientRect();
                    start = rect.y;
                    width = rect.width;
                    x = rect.x;
                    if (headers.length >= i + 1) {
                        end = headers[i + 1].getBoundingClientRect().top;
                    } else {
                        end = start + 200;
                    }

                    break;
                }
            }

            return { start: start, end: end, width: width, x: x };
        }, finnishDate);

        return {
            height: sizes.end - sizes.start,
            width: sizes.width,
            x: sizes.x,
            y: sizes.start,
        };
    } catch (error) {
        console.info(error);
        return null;
    }
};
