import axios from "axios";
import { CommandInteraction, MessageActionRow, MessageEmbed } from "discord.js";
import {
    ApplicationCommandTypes,
    MessageButtonStyles,
} from "discord.js/typings/enums";
import { SlashCommandModule } from "../../types";
import { createButton, randomColor } from "../../util";
import { getConfig } from "../ruokaa-config";
import { DayChangeHourUtc, Restaurant, RestaurantButtons } from "./consts";
import puppeteer, { ElementHandle, Page, ScreenshotClip } from "puppeteer";
type Food = {
    name: string;
    dietInfo: string[];
};

type Category = {
    category: string;
    foods: Food[];
};

type JsonResponse = {
    laseri?: Category[];
    yolo?: Category[];
    lutBuffet?: Category[];
};

const keskusta = (): Category => ({
    category: "Lounas",
    foods: [
        {
            name: "Ruokaa",
            dietInfo: ["Syötävää"],
        },
    ],
});

const ruokaa = async (interaction: CommandInteraction) => {
    await interaction.deferReply();
    const weekday = getWeekday();
    const config = await getConfig();
    const foods = config[weekday];

    try {
        /*
        let data: JsonResponse | undefined = undefined;

        if (
            foods.includes(Restaurant.yolo) ||
            foods.includes(Restaurant.laseri) ||
            foods.includes(Restaurant.lutBuffet)
        ) {
            try {
                const response = await axios(
                    "https://skinfo.juho.space/categories.json"
                );
                data = await response.data;
            } catch (error) {
                console.error("Fetch failed", error);
                data = undefined;
            }
        }
        */

        const embed = new MessageEmbed();
        embed.setTitle("Syödään tänään");
        embed.setColor(randomColor());

        const appendMenu = (categories: Category[], header: string) => {
            const textMenu = [];
            for (const category of categories) {
                textMenu.push(` - ${category.category}:`);
                for (const food of category.foods) {
                    let result = `   ${food.name}`;
                    if (food.dietInfo.length > 0) {
                        result += ` (${food.dietInfo.join("/")})`;
                    }
                    textMenu.push(result);
                }
            }
            embed.addField(header, textMenu.join("\n"), true);
            embed.setTimestamp();
        };

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

                case Restaurant.lutBuffet:
                    //addButton("lutBuffet");
                    break;

                case Restaurant.keskusta:
                    appendMenu([keskusta()], "Keskustassa:");
                    addButton("keskusta");
                    break;
            }
        });

        if (buttonRow.components.length === 0) {
            await interaction.editReply({
                content: "Ei ruokalistoja.",
            });

            return;
        }

        if (buttonRow.components.length > 0) {
            buttonRow.addComponents(
                createButton(
                    generateButtonId("skip"),
                    RestaurantButtons.skip,
                    MessageButtonStyles.SECONDARY
                )
            );
        }

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 10000 });

        await aalefNavigate(page);

        /* Laser */
        await aalefSwitchMenu(page, "Ravintola Laseri");
        const laserClip = await aalefClip(page);
        await clip(page, laserClip, ssNames.laser);

        /* Yolo */
        await aalefSwitchMenu(page, "Ravintola YOLO");
        const yoloClip = await aalefClip(page);
        await clip(page, yoloClip, ssNames.yolo);

        /* Close browser */
        await browser.close();

        await interaction.editReply({
            files: Object.values(ssNames).map(
                (ss) => `src/slash-commands/ruokaa2/${ss}.png`
            ),
            embeds: [embed],
            components: [buttonRow],
        });
    } catch (error) {
        interaction.editReply("Ei ruokalistoja.");
        console.log(error);
    }
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

const ruokaa2 = async (interaction: CommandInteraction) => {
    await interaction.deferReply();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 10000 });

    await aalefNavigate(page);

    /* Laser */
    await aalefSwitchMenu(page, "Ravintola Laseri");
    const laserClip = await aalefClip(page);
    await clip(page, laserClip, ssNames.laser);

    /* Yolo */
    await aalefSwitchMenu(page, "Ravintola YOLO");
    const yoloClip = await aalefClip(page);
    await clip(page, yoloClip, ssNames.yolo);

    /* Close browser */
    await browser.close();

    /* Add images to reply */

    try {
        interaction.editReply({
            files: Object.values(ssNames).map(
                (ss) => `src/slash-commands/ruokaa2/${ss}.png`
            ),
        });
    } catch (error) {
        console.info(error);
        interaction.editReply("Something went wrong :(");
    }
};

const ssNames = {
    laser: "laser-ruokalista",
    yolo: "yolo-ruokalista",
};

const clip = async (page: Page, clip: ScreenshotClip, name: string) => {
    console.info(
        `Clipping ${name} with options: ${JSON.stringify(clip, undefined, 2)}`
    );
    try {
        await page.screenshot({
            clip: clip,
            path: `./src/slash-commands/ruokaa2/${name}.png`,
        });
    } catch (error) {
        console.info(error);
    }
};

const aalefClip = async (page: Page) => {
    console.info("Get aalef clip size");
    try {
        const top = await page.evaluate(() => {
            const headers = document.getElementsByTagName("h3");
            let today;
            let tomorrow;

            for (let i = 0; i < headers.length; i++) {
                const el = headers[i];

                const tomorrowDate = new Date().getDate() + 1;

                if (el.innerText.includes(tomorrowDate.toString())) {
                    today = el.offsetTop;
                }
                if (el.innerText.includes((tomorrowDate + 1).toString())) {
                    tomorrow = el.offsetTop;
                }
                if (today && tomorrow) {
                    break;
                }
            }

            return {
                today: today,
                tomorrow: tomorrow,
            };
        });

        if (
            !top ||
            typeof top.today === "undefined" ||
            typeof top.tomorrow === "undefined"
        ) {
            throw new Error("Top was not there");
        }

        console.log(top);

        return {
            height: top.tomorrow - top.today,
            width: 1200,
            x: 0,
            y: top.today,
        };
    } catch (error) {
        console.info(error);
        return { height: 2000, width: 1200, x: 0, y: 0 };
    }
};

const aalefNavigate = async (page: Page) => {
    console.info("Navigate to aalef");
    await page.goto("https://www.aalef.fi/#ravintolat");

    const gdprfuckery = await page.$x("//button[contains(., 'Kiellä')]");
    (gdprfuckery[0] as ElementHandle<Element>).click();

    // Wait 0.2s for this
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
