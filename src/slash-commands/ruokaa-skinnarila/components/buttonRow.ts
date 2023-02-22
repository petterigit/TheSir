import { MessageActionRow } from "discord.js";
import { MessageButtonStyles } from "discord.js/typings/enums";
import { addButton } from "../../../utils/ruokaa-utils/componentUtils";

export const createButtonRow = async () => {
    const buttonRow = new MessageActionRow();

    addButton(buttonRow, "yolo");
    addButton(buttonRow, "laseri");
    addButton(buttonRow, "lutBuffet");
    addButton(buttonRow, "keskusta", MessageButtonStyles.SECONDARY);
    addButton(buttonRow, "skip", MessageButtonStyles.DANGER);

    return buttonRow;
};
