import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { addButton } from "../../../utils/ruokaa-utils/componentUtils";

export const createButtonRow = async () => {
    const buttonRow = new ActionRowBuilder<ButtonBuilder>();

    addButton(buttonRow, "Yolo", "ruokaa-skinnarila");
    addButton(buttonRow, "Laseri", "ruokaa-skinnarila");
    addButton(buttonRow, "Lut-Buffet", "ruokaa-skinnarila");
    addButton(buttonRow, "Skip", "ruokaa-skinnarila", ButtonStyle.Danger);

    return buttonRow;
};
