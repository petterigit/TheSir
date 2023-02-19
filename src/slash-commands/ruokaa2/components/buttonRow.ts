import { MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createButton } from "../../../util";
import { RestaurantButtons } from "../consts";
import { getWeekdayConfig } from "../utils";

const generateButtonId = (restaurant: string) => `ruokaa ${restaurant}`;

export const createButtonRow = async () => {
    const buttonRow = new MessageActionRow();
    const foods = await getWeekdayConfig();

    const addButton = (restaurant: string) => {
        buttonRow.addComponents(
            createButton(generateButtonId(restaurant), restaurant)
        );
    };

    foods.forEach((food) => addButton(food));

    buttonRow.addComponents(
        createButton(
            generateButtonId("skip"),
            RestaurantButtons.skip,
            MessageButtonStyles.SECONDARY
        )
    );

    return buttonRow;
};
