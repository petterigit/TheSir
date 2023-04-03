import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { addButton } from "../../../utils/ruokaa-utils/componentUtils";

export const createButtonRows = async () => {
    const buttonRow1 = new ActionRowBuilder<ButtonBuilder>();
    const buttonRow2 = new ActionRowBuilder<ButtonBuilder>();

    addButton(buttonRow1, "Lalo", "ruokaa-keskusta");
    addButton(buttonRow1, "Luckie's", "ruokaa-keskusta");
    addButton(buttonRow1, "Rosso", "ruokaa-keskusta");
    addButton(buttonRow2, "Muu keskustarafla", "ruokaa-keskusta");
    addButton(buttonRow2, "Toimistolounas", "ruokaa-keskusta");
    addButton(buttonRow2, "Skip", "ruokaa-keskusta", ButtonStyle.Danger);

    return [buttonRow1, buttonRow2];
};
