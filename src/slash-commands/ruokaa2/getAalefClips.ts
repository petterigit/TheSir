import { ElementHandle, Page, ScreenshotClip } from "puppeteer";
import { ssNames } from "./consts";
import { launchPuppeteer, screenShot } from "./puppeteerUtils";
import { getNextFinnishDay, getWeekday } from "./utils";

const PageWidth = 800;
const PageHeight = 2000;

export const getAalefClips = async () => {
    const browser = await launchPuppeteer();

    const page = await browser.newPage();
    await page.setViewport({ width: PageWidth, height: PageHeight });

    await aalefNavigate(page);

    /* Laser */
    await aalefSwitchMenu(page, "Ravintola Laseri");
    const laserClip = await aalefClip(page);
    if (laserClip) {
        await screenShot(page, laserClip, ssNames.laser.fileLoc);
    }

    /* Yolo */
    await aalefSwitchMenu(page, "Ravintola YOLO");
    const yoloClip = await aalefClip(page);
    if (yoloClip) {
        await screenShot(page, yoloClip, ssNames.yolo.fileLoc);
    }

    /* Close browser */
    await browser.close();
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
                height: PageHeight,
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

const aalefNavigate = async (page: Page) => {
    console.info("Navigate to aalef");
    await page.goto("https://www.aalef.fi/#ravintolat");

    // Wait 2s for page to load properly
    await new Promise((resolve) => setTimeout(resolve, 2000));
};

const aalefSwitchMenu = async (page: Page, menu: string) => {
    console.info("Switch aalef menu to", menu);
    try {
        const menuSelector = await page.$x(`//button[contains(., '${menu}')]`);
        const button = menuSelector[0] as ElementHandle<HTMLElement>;
        await button.click();

        // Wait 2s for page to load properly
        await new Promise((_) => setTimeout(_, 2000));
    } catch (error) {
        console.info(error);
    }
};
