import { ButtonStyle, ActionRowBuilder } from "discord.js";
import { createButton } from "../../util";

const generateButtonId = (idPrefix: string, restaurant: string) =>
    `${idPrefix} ${restaurant}`;

export const addButton = (
    buttonRow: ActionRowBuilder,
    restaurant: string,
    idPrefix: string,
    style?: Exclude<ButtonStyle, "LINK">
) => {
    buttonRow.addComponents(
        createButton(
            generateButtonId(idPrefix, restaurant),
            restaurant,
            style ?? ButtonStyle.Primary
        )
    );
};
