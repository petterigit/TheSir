import { MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { addButton } from "../../../utils/ruokaa-utils/componentUtils";

export const createButtonRow = async () => {
    const buttonRow = new MessageActionRow();

    addButton(buttonRow, "Yolo", "ruokaa-skinnarila");
    addButton(buttonRow, "Laseri", "ruokaa-skinnarila");
    addButton(buttonRow, "Lut-Buffet", "ruokaa-skinnarila");
    addButton(
        buttonRow,
        "Skip",
        "ruokaa-skinnarila",
        MessageButtonStyles.DANGER
    );

    return buttonRow;
};
