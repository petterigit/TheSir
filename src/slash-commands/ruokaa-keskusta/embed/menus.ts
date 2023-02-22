import { ssNames } from "../consts";
import { createMenuEmbed } from "./utils";

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
    const rossoEmbed = createMenuEmbed(ssNames.rosso)
        .setDescription(
            "Rossossa saatavilla päivittäin myös muunmuassa salaattia & pitsua!"
        )
        .setURL(
            "https://www.raflaamo.fi/fi/ravintola/lappeenranta/rosso-isokristiina-lappeenranta/menu/lounas"
        );

    return [laserEmbed, yoloEmbed, lutBuffetEmbed, rossoEmbed];
};
