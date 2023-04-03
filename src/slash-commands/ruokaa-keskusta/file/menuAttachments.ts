import { AttachmentBuilder } from "discord.js";
import { createAttachment } from "../../../utils/ruokaa-utils/embedUtils";
import { ssNames } from "../consts";

export const createMenuAttachments = () => {
    const attachments: AttachmentBuilder[] = [];
    Object.values(ssNames).forEach((ss) => {
        const attachment = createAttachment(ss.fileLoc, ss.filename);

        if (attachment) {
            return attachments.push(attachment);
        }
    });
    return attachments;
};
