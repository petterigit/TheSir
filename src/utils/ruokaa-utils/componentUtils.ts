import { MessageActionRow, ExcludeEnum } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { createButton } from "../../util";

const generateButtonId = (idPrefix: string, restaurant: string) =>
    `${idPrefix} ${restaurant}`;

export const addButton = (
    buttonRow: MessageActionRow,
    restaurant: string,
    idPrefix: string,
    style?: ExcludeEnum<typeof MessageButtonStyles, "LINK">
) => {
    buttonRow.addComponents(
        createButton(
            generateButtonId(idPrefix, restaurant),
            restaurant,
            style ?? MessageButtonStyles.PRIMARY
        )
    );
};
