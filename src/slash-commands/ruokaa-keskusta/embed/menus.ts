import { createMenuEmbed } from "../../../utils/ruokaa-utils/embedUtils";
import { ssNames } from "../consts";

export const createMenuEmbeds = () => {
    const rossoEmbed = createMenuEmbed(ssNames.rosso)
        .setDescription(
            "Rossossa saatavilla päivittäin myös muunmuassa salaattia & pitsua!"
        )
        .setURL(
            "https://www.raflaamo.fi/fi/ravintola/lappeenranta/rosso-isokristiina-lappeenranta/menu/lounas"
        );

    return [rossoEmbed];
};
