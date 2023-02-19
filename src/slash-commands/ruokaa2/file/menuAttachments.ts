import { MessageAttachment } from "discord.js";
import { getFilename } from "../getAalefClips";
import fs from "fs";
import { pathToFile } from "../utils";

export const createMenuAttachments = (
    restaurants: string[]
): MessageAttachment[] => {
    const attachments = restaurants.map((restaurant) => {
        const filename = getFilename(restaurant);
        if (!fs.existsSync(filename)) return;
        return new MessageAttachment(
            pathToFile(getFilename(restaurant)),
            getFilename(restaurant)
        );
    });
    return attachments.filter((attachment) => attachment);
};
