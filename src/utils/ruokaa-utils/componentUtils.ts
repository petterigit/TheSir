import { MessageActionRow, ExcludeEnum } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { RestaurantButtons } from "../../slash-commands/ruokaa/consts";
import { createButton } from "../../util";

const generateButtonId = (restaurant: keyof typeof RestaurantButtons) =>
    `ruokaa-button ${restaurant}`;

export const addButton = (
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
