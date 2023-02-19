import { MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createButton } from "../../../util";
import { getConfig } from "../../ruokaa-config";
import { Restaurant, RestaurantButtons } from "../consts";
import { getWeekday } from "../utils";

const generateButtonId = (restaurant: keyof typeof RestaurantButtons) =>
    `ruokaa ${restaurant}`;

export const createButtonRow = async () => {
    const buttonRow = new MessageActionRow();
    const weekday = getWeekday();
    const config = await getConfig();
    const foods = config[weekday];

    const addButton = (restaurant: keyof typeof RestaurantButtons) => {
        buttonRow.addComponents(
            createButton(
                generateButtonId(restaurant),
                RestaurantButtons[restaurant]
            )
        );
    };

    foods.forEach((food) => {
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

    return buttonRow;
};
