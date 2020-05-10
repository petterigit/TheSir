const dimensions = {
    width: 800,
    height: 800
};
const margins = {
    top: 100,
    bot: -100,
    left: 100,
    right: -100
};
const options = {
    fontSize: 64,
    strokeWidth: 5,
    strokeColor: "black",
    textColor: "white",
    textAlign: "center",
    lineHeight: 64,
    fontWidthMultiplier: 10
};

const fs = require("fs");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");
registerFont(path.join(__dirname, "fonts/PressStart2P-Regular.ttf"), {family: "pixel"});

const praiseFile = fs.readFileSync(path.join(__dirname, "texts/praises.json"));
const praise = JSON.parse(praiseFile);


const generatePraise = async(shameInstead = false) => {
    const canvas = createCanvas(dimensions.width, dimensions.height);
    const ctx = canvas.getContext("2d");

    const sentence = getSentence(shameInstead);
    let lines = getLines(ctx, sentence, canvas.width - margins.left + margins.right);
    
    let img = null;
    if(shameInstead) {
        img = await loadImage(path.join(__dirname, "images/sad blob.jpg"));
    } else {
        lines = lines.reverse();
        img = await loadImage(path.join(__dirname, "images/uni.jpg"));
    }

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = options.strokeColor
    ctx.lineWidth = options.strokeWidth;
    ctx.fillStyle = options.textColor;
    ctx.textAlign = options.textAlign;

    ctx.font = `${options.fontSize}px pixel`;

    let x = canvas.width / 2;
    let y = canvas.height + margins.bot;

    if(shameInstead) {
        y = margins.top;
    }

    const lineCount = lines.length;

    for(let i = 0; i < lineCount; i++) {
        if(i != 0) {
            if(shameInstead) {
                y += options.lineHeight;
            } else {
                y -= options.lineHeight;
            }
        }
        ctx.fillText(lines[i], x, y);
        ctx.strokeText(lines[i], x, y);
    }
    
    return canvas.toBuffer();
}

const getLines = (ctx, text, maxWidth) => {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for(let i = 1; i < words.length; i++) {
        let word = words[i];
        let width = ctx.measureText(currentLine + " " + word).width * options.fontWidthMultiplier;
        if(width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

const getSentence = (shameInstead) => {
    let sentence = "";
    if(shameInstead) {
        size = praise.shame.length;
        sentence = praise.shame[randomInteger(0, size)];
    } else {
        size = praise.praise.length;
        sentence = praise.praise[randomInteger(0, size)];
    }
    return sentence;
}

// end exclusive
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

exports.generatePraise = generatePraise;
