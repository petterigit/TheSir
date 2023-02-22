import { MessageAttachment } from "discord.js";
import { ssNames } from "../consts";

export const createMenuAttachments = () => {
    const attachments = Object.values(ssNames).map(
        (ss) => new MessageAttachment(ss.fileLoc, ss.filename)
    );
    return attachments;
};
