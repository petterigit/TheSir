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

import * as praise from "./texts/praises.json";
import sample from "lodash/sample";

registerFont(path.join(__dirname, "fonts/PressStart2P-Regular.ttf"), {
    family: "pixel",
});

export const generatePraise = async (
    shameInstead = false,
    customMessage?: string
): Promise<Buffer> => {
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d");

    const sentence = customMessage ? customMessage : getSentence(shameInstead);
    let lines = getLines(
        ctx,
        sentence,
        canvas.width - margins.left + margins.right
    );

    let img = null;
    if (shameInstead) {
        img = await loadImage(path.join(__dirname, "images/sad blob.jpg"));
    } else {
        lines = lines.reverse();
        img = await loadImage(path.join(__dirname, "images/uni.jpg"));
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeWidth;
    ctx.fillStyle = options.textColor;
    ctx.textAlign = options.textAlign as CanvasTextAlign;

    ctx.font = `${options.fontSize}px pixel`;

    const x = canvas.width / 2;
    let y = canvas.height + margins.bot;

    if (shameInstead) {
        y = margins.top;
    }

    const lineCount = lines.length;

    for (let i = 0; i < lineCount; i++) {
        if (i != 0) {
            if (shameInstead) {
                y += options.lineHeight;
            } else {
                y -= options.lineHeight;
            }
        }
        ctx.fillText(lines[i], x, y);
        ctx.strokeText(lines[i], x, y);
    }
    return canvas.toBuffer();
};

const getLines = (
    ctx: NodeCanvasRenderingContext2D,
    text: string,
    maxWidth: number
) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width =
            ctx.measureText(currentLine + " " + word).width *
            options.fontWidthMultiplier;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
};

const getSentence = (shameInstead: boolean) => {
    let sentence = "";
    if (shameInstead) {
        sentence = sample(praise.shame);
    } else {
        sentence = sample(praise.praise);
    }
    return sentence;
};
