import { MessageActionRow, ExcludeEnum } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createButton } from "../../util";

const generateButtonId = (restaurant: string) => `ruokaa-button ${restaurant}`;

export const addButton = (
    buttonRow: MessageActionRow,
    restaurant: string,
    style?: ExcludeEnum<typeof MessageButtonStyles, "LINK">
) => {
    buttonRow.addComponents(
        createButton(
            generateButtonId(restaurant),
            restaurant,
            style ?? MessageButtonStyles.PRIMARY
        )
    );
};
