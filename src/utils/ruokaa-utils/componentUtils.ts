import { ButtonStyle, ActionRowBuilder } from "discord.js";
import { createButton } from "../../util";

export const generateButtonId = (
    idPrefix: string,
    restaurant: number | string
) => `${idPrefix} ${restaurant}`;

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

export const addButtonKeskusta = (
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
