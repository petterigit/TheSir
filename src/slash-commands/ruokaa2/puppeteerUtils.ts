import path from "path";
import puppeteer, { Page, ScreenshotClip } from "puppeteer";

export const launchPuppeteer = async () => {
    const pathToExtension = path.join(
        process.cwd(),
        "block-cookies-extension/3.4.6_0"
    );

    const browser = await puppeteer.launch({
        headless: false, // !! HUGE !! BY SETTING THIS TO FALSE YOU CAN SEE WHAT IT DOES ON YOUR OWN COMPUTER POG !!
        // ( and it's required server side .. )
        args: [
            "--no-sandbox",
            `--disable-extensions-except=${pathToExtension}`,
            `--load-extension=${pathToExtension}`,
        ],
    });

    return browser;
};

export const screenShot = async (
    page: Page,
    clip: ScreenshotClip,
    fileLoc: string
) => {
    console.log(
        `Taking screenshot ${fileLoc} with options: ${JSON.stringify(
            clip,
            undefined,
            2
        )}`
    );
    try {
        await page.screenshot({
            clip: clip,
            path: `${fileLoc}`,
        });
    } catch (error) {
        console.error(error);
    }
};
