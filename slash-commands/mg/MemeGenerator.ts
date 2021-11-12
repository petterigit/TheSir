"use strict";

import path from "path";
import {
    createCanvas,
    loadImage,
    NodeCanvasRenderingContext2D,
    registerFont,
} from "canvas";

import memes from "./texts/memes.json";
import { ApplicationCommandOptionData } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";

registerFont(
    path.join(process.cwd(), "/public/fonts/PressStart2P-Regular.ttf"),
    {
        family: "pixel",
    }
);

export type TextBox = {
    name: string;
    x: number;
    y: number;
    height: number;
    width: number;
    lines?: string[];
    lineHeight?: number;
    marginLeft: number;
    description: string;
};

export type MemeSentence = {
    name: string;
    type: string;
    value: string;
};

export type MemeImage = {
    imageFileName: string;
    name: string;
    description: string;
    width: number;
    height: number;
    fontSize: number;
    strokeWidth: number;
    strokeColor: string;
    textColor: string;
    fontWidthMultiplier: number;
    textAlign: string;
    lineHeight: number;
    textBoxes: TextBox[];
};

export type MemeOptions = {
    name: string;
    type: string;
    options: MemeSentence[];
};

export const generateMeme = async (
    memeOptions: MemeOptions
): Promise<Buffer> => {
    const memeImage: MemeImage = memes.data.find((image) => {
        return image.name === memeOptions.name;
    });

    const canvas = createCanvas(memeImage.width, memeImage.height);
    const ctx = canvas.getContext("2d");
    const img = await loadImage(
        path.join(process.cwd(), "public/images/", memeImage.imageFileName)
    );

    ctx.font = `${memeImage.fontSize.toString()}px pixel`;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = memeImage.strokeColor;
    ctx.lineWidth = memeImage.strokeWidth;
    ctx.fillStyle = memeImage.textColor;
    ctx.textAlign = memeImage.textAlign as CanvasTextAlign;
    memeImage.textBoxes.forEach((textBox) => {
        const sentence = memeOptions.options.find(
            (sentence) => sentence.name === textBox.name
        );
        const { lines, lineHeight } = matchSentenceIntoTextbox(
            ctx,
            sentence.value,
            textBox,
            memeImage
        );
        textBox.lines = lines;
        textBox.lineHeight = lineHeight;
    });

    memeImage.textBoxes.forEach((textbox) => {
        let height = textbox.y + textbox.lineHeight;
        let x: number;
        if (memeImage.textAlign === "center") {
            x = textbox.x + textbox.width / 2;
        } else {
            x = textbox.x + textbox.marginLeft;
        }
        textbox.lines.forEach((line) => {
            ctx.fillText(line, x, height, textbox.width - textbox.marginLeft);
            ctx.strokeText(line, x, height, textbox.width - textbox.marginLeft);
            height += textbox.lineHeight;
        });
    });
    return canvas.toBuffer();
};

const matchSentenceIntoTextbox = (
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    textBox: TextBox,
    meme: MemeImage
) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];
    const lineHeight = meme.lineHeight;

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width =
            ctx.measureText(currentLine + " " + word).width *
            meme.fontWidthMultiplier;
        if (width < textBox.width - textBox.marginLeft) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    //tarkista et korkeus ei oo liikaa.
    return { lines, lineHeight };
};

export const genCommandOptions = (): ApplicationCommandOptionData[] => {
    const memeOptions: ApplicationCommandOptionData[] = memes.data.map(
        (meme) => {
            const option: ApplicationCommandOptionData = {
                name: meme.name,
                description: meme.description,
                type: ApplicationCommandOptionTypes.SUB_COMMAND,
                options: meme.textBoxes.map((textbox) => {
                    return {
                        name: textbox.name,
                        description: textbox.description,
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                    };
                }),
            };
            return option;
        }
    );
    return memeOptions;
};
