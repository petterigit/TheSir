import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { addButtonKeskusta } from "../../../utils/ruokaa-utils/componentUtils";
import { restaurants } from "../consts";

export const createButtonRows = async () => {
    const buttonRow1 = new ActionRowBuilder<ButtonBuilder>();
    const buttonRow2 = new ActionRowBuilder<ButtonBuilder>();
    const buttonRow3 = new ActionRowBuilder<ButtonBuilder>();

    addButtonKeskusta(buttonRow1, restaurants.kitchen, "ruokaa-keskusta");
    addButtonKeskusta(
        buttonRow1,
        restaurants.kattavaKonttori,
        "ruokaa-keskusta"
    );
    addButtonKeskusta(buttonRow1, restaurants.kattavaSaimaa, "ruokaa-keskusta");
    addButtonKeskusta(buttonRow1, restaurants.miku, "ruokaa-keskusta");

    addButtonKeskusta(buttonRow2, restaurants.lalo, "ruokaa-keskusta");
    addButtonKeskusta(buttonRow2, restaurants.luckies, "ruokaa-keskusta");
    addButtonKeskusta(buttonRow2, restaurants.rosso, "ruokaa-keskusta");

    addButtonKeskusta(
        buttonRow3,
        restaurants.any,
        "ruokaa-keskusta",
        ButtonStyle.Secondary
    );
    addButtonKeskusta(
        buttonRow3,
        restaurants.other,
        "ruokaa-keskusta",
        ButtonStyle.Secondary
    );
    addButtonKeskusta(
        buttonRow3,
        restaurants.toimistolounas,
        "ruokaa-keskusta",
        ButtonStyle.Secondary
    );
    addButtonKeskusta(
        buttonRow3,
        restaurants.skip,
        "ruokaa-keskusta",
        ButtonStyle.Danger
    );

    return [buttonRow1, buttonRow2, buttonRow3];
};
