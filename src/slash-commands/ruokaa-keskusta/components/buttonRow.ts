import { MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { addButton } from "../../../utils/ruokaa-utils/componentUtils";

export const createButtonRows = async () => {
    const buttonRow1 = new MessageActionRow();
    const buttonRow2 = new MessageActionRow();

    addButton(buttonRow1, "Lalo", "ruokaa-keskusta");
    addButton(buttonRow1, "Luckie's", "ruokaa-keskusta");
    addButton(buttonRow1, "Rosso", "ruokaa-keskusta");
    addButton(buttonRow2, "Muu keskustarafla", "ruokaa-keskusta");
    addButton(buttonRow2, "Toimistolounas", "ruokaa-keskusta");
    addButton(
        buttonRow2,
        "Skip",
        "ruokaa-keskusta",
        MessageButtonStyles.DANGER
    );

    return [buttonRow1, buttonRow2];
};
