import { ExcludeEnum, MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createButton } from "../../../util";
import { RestaurantButtons } from "../consts";

const generateButtonId = (restaurant: keyof typeof RestaurantButtons) =>
    `ruokaa2 ${restaurant}`;

const addButton = (
    buttonRow: MessageActionRow,
    restaurant: keyof typeof RestaurantButtons,
    style?: ExcludeEnum<typeof MessageButtonStyles, "LINK">
) => {
    buttonRow.addComponents(
        createButton(
            generateButtonId(restaurant),
            RestaurantButtons[restaurant],
            style ?? MessageButtonStyles.PRIMARY
        )
    );
};

export const createButtonRow = async () => {
    const buttonRow = new MessageActionRow();

    addButton(buttonRow, "yolo");
    addButton(buttonRow, "laseri");
    addButton(buttonRow, "lutBuffet");
    addButton(buttonRow, "keskusta", MessageButtonStyles.SECONDARY);
    addButton(buttonRow, "skip", MessageButtonStyles.DANGER);

    return buttonRow;
};
