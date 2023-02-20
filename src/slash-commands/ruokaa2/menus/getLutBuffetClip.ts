import { Browser, Page, ScreenshotClip } from "puppeteer";
import { ssNames } from "../consts";
import { clickButton, navigateToPage, screenShot } from "../puppeteerUtils";
import { getWeekday, getNextFinnishDay } from "../utils";

const PageWidth = 800;
const PageHeight = 2000;

export const getLutBuffetClip = async (browser: Browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width: PageWidth, height: PageHeight });

    await navigateToPage(
        page,
        "https://fi.jamix.cloud/apps/menu/?anro=97383&k=1&mt=4"
    );

    await clickButton(page, "ti", "span");

    const clip = await lutBuffetClip(page);
    if (clip) {
        await screenShot(page, clip, ssNames.lutBuffet.fileLoc);
    }

    /* Close browser */
    await browser.close();
};

const lutBuffetClip = async (page: Page): Promise<ScreenshotClip | null> => {
    console.info("Get lut buffet clip size");

    const weekDay = getWeekday();
    const tomorrowDate = getNextFinnishDay(weekDay);

    try {
        const top = await page.evaluate((tomorrowDate: string) => {
            const divs = Array.from(document.getElementsByTagName("div"));
            let start;
            let end;

            for (let i = 0; i < divs.length; i++) {
                const el = divs[i];

                if (
                    el.innerText
                        .toLowerCase()
                        .includes(tomorrowDate.toLowerCase())
                ) {
                    start = el.offsetTop;
                    break;
                }
            }

            const spans = Array.from(document.getElementsByTagName("span"));
            for (let i = 0; i < spans.length; i++) {
                const el = spans[i];

                if (el.innerText.includes("Ruokavaliot")) {
                    end = el.offsetTop;
                    break;
                }
            }

            return {
                start: start,
                end: end,
            };
        }, tomorrowDate);

        console.info(top);

        if (
            !top ||
            typeof top.start === "undefined" ||
            typeof top.end === "undefined"
        ) {
            throw new Error("Top was not there");
        }

        const clipHeight = top.end - top.start;
        if (clipHeight <= 0) {
            console.info(
                "Clip height was 0 or smaller. Query selector probably failed"
            );
            console.info("Trying to get the height more or less right..");
            return {
                width: PageWidth,
                height: PageHeight,
                x: 0,
                y: top.start,
            };
        }

        return {
            height: clipHeight,
            width: PageWidth,
            x: 0,
            y: top.start,
        };
    } catch (error) {
        console.info(error);
        return null;
    }
};
