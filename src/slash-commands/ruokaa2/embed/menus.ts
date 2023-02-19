import { createMenuEmbed } from "./utils";

export const createMenuEmbeds = (restaurants: string[]) => {
    const menus = restaurants.map((restaurant) => createMenuEmbed(restaurant));

    return menus.filter((menu) => menu);
};
