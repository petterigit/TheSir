import { createMenuEmbed } from "../../../utils/ruokaa-utils/embedUtils";
import { ssNames } from "../consts";

export const createMenuEmbeds = () => {
    const laserEmbed = createMenuEmbed(ssNames.laser).setURL(
        "https://www.aalef.fi/#ravintolat#yolo"
    );
    const yoloEmbed = createMenuEmbed(ssNames.yolo).setURL(
        "https://www.aalef.fi/#ravintolat#laser"
    );
    const lutBuffetEmbed = createMenuEmbed(ssNames.lutBuffet).setURL(
        "https://fi.jamix.cloud/apps/menu/?anro=97383&k=1&mt=4"
    );

    return [laserEmbed, yoloEmbed, lutBuffetEmbed];
};
