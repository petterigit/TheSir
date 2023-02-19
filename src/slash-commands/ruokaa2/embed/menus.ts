import { ssNames } from "../consts";
import { createMenuEmbed } from "./utils";

export const createMenuEmbeds = () => {
    const menus = Object.values(ssNames).map((ss) => createMenuEmbed(ss));

    return menus;
};
