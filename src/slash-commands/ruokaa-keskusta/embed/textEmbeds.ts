import { EmbedBuilder } from "discord.js";

export const createTextEmbeds = () => {
    const embeds = [
        new EmbedBuilder()
            .setTitle(`Lalo`)
            .setDescription(
                "Burgeria. Nam! Linkistä löytyy päivittäiset listat."
            )
            .setURL("https://www.facebook.com/LALOValtakatu46?locale=fi_FI"),

        new EmbedBuilder()
            .setTitle(`Luckie's`)
            .setDescription("Sushia. Nam!")
            .setURL(
                "https://www.luckiefun.com/en/restaurants/lappeenranta/isokristiina/"
            ),
        new EmbedBuilder()
            .setTitle("Rosso")
            .setDescription(
                "Rossossa saatavilla päivittäin vaihtuva lounas, viikottain vaihtuvat pasta & salaatti, sekä aina yhtä turvallinen pitsa haluamillaan täytteillä."
            )
            .setURL(
                "https://www.raflaamo.fi/fi/ravintola/lappeenranta/rosso-isokristiina-lappeenranta/menu/lounas"
            ),
        new EmbedBuilder()
            .setTitle("The Kitchen")
            .setDescription(
                "Mitä sitä kursailemaan, tarjoamme kaupungin parhaan ja monipuolisimman lounaan, The Lunchin. Päivittäin vaihtuva runsas kattaus valmistetaan samalla ammattiylpeydellä ja käsityöllä kuin à la carte -annoksemme."
            )
            .setURL("https://ravintolakitchen.fi/lounas-2/"),
        new EmbedBuilder()
            .setTitle("Kattava")
            .setDescription(
                `
Ravintola Saimaa tarjoilee herkullista buffet-lounasta upeissa maisemissa Osuuspankin 6. kerroksessa
Ravintola Konttori tarjoaa hyväntuulisen ja -makuisen levähdyshetken työpäivään kaupungin keskeisimmällä paikalla, virastotalon P-kerroksessa. Meille pääset kätevästi joko kaupungintalon aukiolta tai Pormestarinkadulta, skeittiparkin kupeesta.
Lounaan hinta 13,90€
                `
            )
            .setURL("https://kattavacatering.fi/lounas/"),
        new EmbedBuilder()
            .setTitle("Miku")
            .setDescription(
                "Ihan tosi söpöt seinät. Ala carte. Hintaan jotain 13-14.50€. 😻😻"
            )
            .setURL("https://www.facebook.com/CafeMikuLPR/"),
    ];
    return embeds;
};
