import path from "path";
import puppeteer, { ElementHandle, Page, ScreenshotClip } from "puppeteer";

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

export const navigateToPage = async (page: Page, url: string) => {
    await page.goto(url, {
        waitUntil: "load",
    });
};

/**
 *
 * @param page
 * @param textContent
 * @param element Override if button is not an html button element
 */
export const clickButton = async (
    page: Page,
    textContent: string,
    element?: string
) => {
    console.log("Click button with text content", textContent);

    const el = element ?? "button";

    try {
        const buttonSelector = await page.$x(
            `//${el}[contains(., '${textContent}')]`
        );
        const button = buttonSelector[0] as ElementHandle<HTMLElement>;

        await button.click();

        // Wait 2s for page to load properly
        await new Promise((_) => setTimeout(_, 2000));
    } catch (error) {
        console.log(error);
    }
};
