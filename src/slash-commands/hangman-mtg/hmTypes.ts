import {
    DMChannel,
    Message,
    NewsChannel,
    PartialDMChannel,
    TextChannel,
    ThreadChannel,
} from "discord.js";

export type GameState = {
    active: boolean;
    guessedCharacters: string[];
    knownCharacters: string[];
    guessesLeft: number;
    word: string;
    wordExplanation: string;
    errorMessage: string;
    channelID: string;
    hangmanMessage: Message;
};

export type MessageParams = {
    messageChannel:
        | DMChannel
        | PartialDMChannel
        | TextChannel
        | NewsChannel
        | ThreadChannel;
    currentChannelID: string;
    guessCharacter: string;
};

export interface CardData {
    object: string;
    id: string;
    oracle_id: string;
    multiverse_ids: [number];
    mtgo_id: number;
    mtgo_foil_id: number;
    tcgplayer_id: number;
    cardmarket_id: number;
    name: string;
    lang: string;
    released_at: string;
    uri: string;
    scryfall_uri: string;
    layout: string;
    highres_image: boolean;
    image_status: string;
    image_uris: {
        small: string;
        normal: string;
        large: string;
        png: string;
        art_crop: string;
        border_crop: string;
    };
    mana_cost: string;
    cmc: number;
    type_line: string;
    oracle_text: string;
    colors: [string];
    color_identity: [string];
    keywords: [];
    legalities: {
        standard: "legal" | "not_legal";
        future: "legal" | "not_legal";
        historic: "legal" | "not_legal";
        gladiator: "legal" | "not_legal";
        pioneer: "legal" | "not_legal";
        explorer: "legal" | "not_legal";
        modern: "legal" | "not_legal";
        legacy: "legal" | "not_legal";
        pauper: "legal" | "not_legal";
        vintage: "legal" | "not_legal";
        penny: "legal" | "not_legal";
        commander: "legal" | "not_legal";
        oathbreaker: "legal" | "not_legal";
        brawl: "legal" | "not_legal";
        historicbrawl: "legal" | "not_legal";
        alchemy: "legal" | "not_legal";
        paupercommander: "legal" | "not_legal";
        duel: "legal" | "not_legal";
        oldschool: "legal" | "not_legal";
        premodern: "legal" | "not_legal";
        predh: "legal" | "not_legal";
    };
    games: string[];
    reserved: boolean;
    foil: boolean;
    nonfoil: boolean;
    finishes: string[];
    oversized: boolean;
    promo: boolean;
    reprint: boolean;
    variation: boolean;
    set_id: string;
    set: string;
    set_name: string;
    set_type: string;
    set_uri: string;
    set_search_uri: string;
    scryfall_set_uri: string;
    rulings_uri: string;
    prints_search_uri: string;
    collector_number: string;
    digital: boolean;
    rarity: string;
    flavor_text: string;
    card_back_id: string;
    artist: string;
    artist_ids: string[];
    illustration_id: string;
    border_color: string;
    frame: string;
    full_art: boolean;
    textless: boolean;
    booster: boolean;
    story_spotlight: boolean;
    edhrec_rank: number;
    prices: {
        usd: string;
        usd_foil: string;
        usd_etched: string;
        eur: string;
        eur_foil: string;
        tix: string;
    };
    related_uris: {
        gatherer: string;
        tcgplayer_infinite_articles: string;
        tcgplayer_infinite_decks: string;
        edhrec: string;
    };
    purchase_uris: {
        tcgplayer: string;
        cardmarket: string;
        cardhoarder: string;
    };
}
