import {
    CommandInteraction,
    MessageActionRow,
    MessageAttachment,
    MessageEmbed,
} from "discord.js";
import {
    ApplicationCommandTypes,
    MessageButtonStyles,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createButton, randomColor } from "../../util";
import { getConfig } from "../ruokaa-config";
import { DayChangeHourUtc, Restaurant, RestaurantButtons } from "./consts";
import puppeteer, { ElementHandle, Page, ScreenshotClip } from "puppeteer";
import path from "path";

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const weekday = getWeekday();
    const config = await getConfig();
    const foods = config[weekday];

    try {
        const voteEmbed = new MessageEmbed();
        voteEmbed.setTitle("Äänestä ruokapaikkaa");
        voteEmbed.setColor(randomColor());

        const buttonRow = new MessageActionRow();
        const addButton = (restaurant: keyof typeof RestaurantButtons) => {
            buttonRow.addComponents(
                createButton(
                    generateButtonId(restaurant),
                    RestaurantButtons[restaurant]
                )
            );
        };

        foods.map((food) => {
            switch (food) {
                case Restaurant.yolo:
                    addButton("yolo");
                    break;
                case Restaurant.laseri:
                    addButton("laseri");
                    break;
                case Restaurant.keskusta:
                    addButton("keskusta");
                    break;
            }
        });

        if (buttonRow.components.length > 0) {
            buttonRow.addComponents(
                createButton(
                    generateButtonId("skip"),
                    RestaurantButtons.skip,
                    MessageButtonStyles.SECONDARY
                )
            );
        }

        const pathToExtension = path.join(
            process.cwd(),
            "block-cookies-extension/3.4.6_0"
        );

        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                `--disable-extensions-except=${pathToExtension}`,
                `--load-extension=${pathToExtension}`,
            ],
        });

        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 2000 });

        await aalefNavigate(page);

        /* Laser */
        await aalefSwitchMenu(page, "Ravintola Laseri");
        const laserClip = await aalefClip(page);
        if (laserClip) {
            await clip(page, laserClip, ssNames.laser.fileLoc);
        }

        /* Yolo */
        await aalefSwitchMenu(page, "Ravintola YOLO");
        const yoloClip = await aalefClip(page);
        if (yoloClip) {
            await clip(page, yoloClip, ssNames.yolo.fileLoc);
        }

        /* Close browser */
        await browser.close();

        if (buttonRow.components.length === 0) {
            await interaction.editReply({
                content: "Ei ruokalistoja.",
            });

            return;
        }

        await interaction.editReply({
            embeds: [
                ...Object.values(ssNames).map((ss) => createMenuEmbed(ss)),
            ],
            files: [
                ...Object.values(ssNames).map(
                    (ss) => new MessageAttachment(ss.fileLoc, ss.filename)
                ),
            ],
            components: [buttonRow],
        });
    } catch (error) {
        interaction.editReply(`Ei ruokalistoja. Error: ${error}`);
        console.log(error);
    }
};

const createMenuEmbed = (ss: {
    filename: string;
    fileLoc: string;
    title: string;
}) => {
    const embed = new MessageEmbed()
        .setImage(`attachment://${ss.filename}`)
        .setTitle(`Ruokalista - ${ss.title}`);
    return embed;
};

const getWeekday = () => {
    const date = new Date();
    const hour = date.getUTCHours();
    let day = date.getUTCDay();
    if (hour >= DayChangeHourUtc) day++;
    if (day === 7) day = 0;
    return day;
};

const generateButtonId = (restaurant: keyof typeof RestaurantButtons) =>
    `ruokaa ${restaurant}`;

const command: SlashCommandModule = {
    data: {
        type: ApplicationCommandTypes.CHAT_INPUT,
        name: ["ruokaa2"],
        description: "Daily lunch planner (highly experimental version)",
    },
    async execute(message: CommandInteraction) {
        await ruokaa(message);
    },
};

const pathToPNG = (imageName: string) =>
    path.join(process.cwd(), `${imageName}.png`);

const ssNames = {
    laser: {
        filename: "laser-ruokalista.png",
        fileLoc: pathToPNG("laser-ruokalista"),
        title: "Laseri",
    },
    yolo: {
        filename: "yolo-ruokalista.png",
        fileLoc: pathToPNG("yolo-ruokalista"),
        title: "YOLO",
    },
};

const clip = async (page: Page, clip: ScreenshotClip, fileLoc: string) => {
    console.info(
        `Clipping ${fileLoc} with options: ${JSON.stringify(
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
        console.info(error);
    }
};

const aalefClip = async (page: Page): Promise<ScreenshotClip | null> => {
    console.info("Get aalef clip size");
    try {
        const top = await page.evaluate(() => {
            const headers = Array.from(document.getElementsByTagName("h3"));
            let tomorrow;
            let afterTomorrow;

            // TEMPORARY
            const tomorrowDate = new Date().getDate() + 2;
            for (let i = 0; i < headers.length; i++) {
                const el = headers[i];

                if (el.innerText.includes(tomorrowDate.toString())) {
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
        });

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
                height: 2000,
                width: 1200,
                x: 0,
                y: top.tomorrow,
            };
        }

        return {
            height: clipHeight,
            width: 1200,
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

export default command;
