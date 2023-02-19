import { MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createButton } from "../../../util";
import { RestaurantButtons } from "../consts";

const generateButtonId = (restaurant: keyof typeof RestaurantButtons) =>
    `ruokaa ${restaurant}`;

const addButton = (
    buttonRow: MessageActionRow,
    restaurant: keyof typeof RestaurantButtons
) => {
    buttonRow.addComponents(
        createButton(
            generateButtonId(restaurant),
            RestaurantButtons[restaurant]
        )
    );
};

export const createButtonRow = async () => {
    const buttonRow = new MessageActionRow();

    addButton(buttonRow, "yolo");
    addButton(buttonRow, "laseri");
    addButton(buttonRow, "keskusta");
    buttonRow.addComponents(
        createButton(
            generateButtonId("skip"),
            RestaurantButtons.skip,
            MessageButtonStyles.SECONDARY
        )
    );

    return buttonRow;
};
