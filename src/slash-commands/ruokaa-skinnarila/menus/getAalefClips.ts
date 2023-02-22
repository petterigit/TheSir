import { Browser, Page, ScreenshotClip } from "puppeteer";
import { ssNames } from "../consts";
import { clickButton, navigateToPage, screenShot } from "../puppeteerUtils";
import { getWeekday, getNextFinnishDay } from "../utils";

const PageWidth = 800;
const PageHeight = 2000;

export const getAalefClips = async (browser: Browser) => {
    const page = await browser.newPage();
    await page.setViewport({ width: PageWidth, height: PageHeight });

    await navigateToPage(page, "https://www.aalef.fi/#ravintolat");

    /* Laser */
    await clickButton(page, "Ravintola Laseri");
    const laserClip = await aalefClip(page);
    if (laserClip) {
        await screenShot(page, laserClip, ssNames.laser.fileLoc);
    }

    /* Yolo */
    await clickButton(page, "Ravintola YOLO");
    const yoloClip = await aalefClip(page);
    if (yoloClip) {
        await screenShot(page, yoloClip, ssNames.yolo.fileLoc);
    }
};

const aalefClip = async (page: Page): Promise<ScreenshotClip | null> => {
    console.info("Get aalef clip size");

    const weekDay = getWeekday();
    const tomorrowDate = getNextFinnishDay(weekDay);

    try {
        const top = await page.evaluate((tomorrowDate: string) => {
            const headers = Array.from(document.getElementsByTagName("h3"));
            let tomorrow;
            let afterTomorrow;

            // TEMPORARY
            //const tomorrowDate = new Date().getDate() + 2;
            for (let i = 0; i < headers.length; i++) {
                const el = headers[i];

                if (el.innerText.includes(tomorrowDate)) {
                    tomorrow = el.offsetTop;
                    if (tomorrow === 0) {
                        // If the element is not visible, it will be 0. Skip.
                        // Would have to check if any of the parent elements have display: none
                        continue;
                    }
                    if (headers.length >= i + 1) {
                        afterTomorrow = headers[i + 1].offsetTop;
                    } else {
                        afterTomorrow = tomorrow + 1200; // 1200 height if this fails
                    }

                    break;
                }
            }

            return {
                tomorrow: tomorrow,
                afterTomorrow: afterTomorrow,
            };
        }, tomorrowDate);

        if (
            !top ||
            typeof top.tomorrow === "undefined" ||
            typeof top.afterTomorrow === "undefined"
        ) {
            throw new Error("Top was not there");
        }

        const clipHeight = top.afterTomorrow - top.tomorrow;
        console.log(top);
        if (clipHeight <= 0) {
            console.info(
                "Clip height was 0 or smaller. Query selector probably failed"
            );
            console.info("Trying to get the height more or less right..");
            return {
                width: PageWidth,
                height: 600,
                x: 0,
                y: top.tomorrow,
            };
        }

        return {
            height: clipHeight,
            width: PageWidth,
            x: 0,
            y: top.tomorrow,
        };
    } catch (error) {
        console.info(error);
        return null;
    }
};
