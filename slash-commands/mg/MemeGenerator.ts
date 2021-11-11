"use strict";
const dimensions = {
    width: 800,
    height: 800,
};
const margins = {
    top: 100,
    bot: -100,
    left: 100,
    right: -100,
};
const options = {
    fontSize: 64,
    strokeWidth: 5,
    strokeColor: "black",
    textColor: "white",
    textAlign: "center",
    lineHeight: 64,
    fontWidthMultiplier: 12,
};
import path from "path";
import {
    createCanvas,
    loadImage,
    NodeCanvasRenderingContext2D,
    registerFont,
} from "canvas";

import sample from "lodash/sample";
import memes from "./texts/memes.json";

registerFont(
    path.join(process.cwd(), "/public/fonts/PressStart2P-Regular.ttf"),
    {
        family: "pixel",
    }
);

type TextBox = {
    name: string;
    x: number;
    y: number;
    height: number;
    width: number;
    lines?: string[];
    lineHeight?: number;
};

type MemeSentence = {
    name: string;
    sentence: string;
};

type MemeImage = {
    imageFileName: string;
    textBoxes: TextBox[];
};

type MemeOptions = {
    imageFileName: string;
    sentences: MemeSentence[];
};

export const generateMeme = async (
    memeOptions: MemeOptions
): Promise<Buffer> => {
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d");
    const memeImage: MemeImage = memes.data.find((image) => {
        image.imageFileName === memeOptions.imageFileName;
    });

    const img = await loadImage(
        path.join(process.cwd(), "public/images/", memeImage.imageFileName)
    );

    memeImage.textBoxes.forEach((textBox) => {
        const sentence = memeOptions.sentences.find(
            (sentence) => (sentence.name = textBox.name)
        );
        const lines = matchSentenceIntoTextbox(ctx, sentence.sentence, textBox);
        textBox.lines = lines;
    });

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeWidth;
    ctx.fillStyle = options.textColor;
    ctx.textAlign = options.textAlign as CanvasTextAlign;

    ctx.font = `${options.fontSize}px pixel`;

    memeImage.textBoxes.forEach((textbox) => {
        let height = textbox.y;
        textbox.lines.forEach((line) => {
            ctx.fillText(line, textbox.x, height);
            ctx.strokeText(line, textbox.x, height);
            height += textbox.lineHeight;
        });
    });
    return canvas.toBuffer();
};

const matchSentenceIntoTextbox = (
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    textBox: TextBox
) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width =
            ctx.measureText(currentLine + " " + word).width *
            options.fontWidthMultiplier;
        if (width < textBox.width) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    //tarkista et korkeus ei oo liikaa.
    return lines;
};
