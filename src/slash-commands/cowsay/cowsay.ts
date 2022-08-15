const cow = `\
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

export const generateCowsay = (message: string, columns = 20) => {
    let bubble = generateBubble(message, columns);
    bubble += cow;
    return bubble;
};

const generateBubble = (message: string, columns: number) => {
    const words = message.split(" ");
    const parsedWords = words.reduce((acc: string[], word: string) => {
        while (word.length > columns) {
            acc.push(word.substring(0, columns));
            word = word.substring(columns);
        }
        acc.push(word);
        return acc;
    }, []);

    const lines: string[] = [];
    let lineAccumulator = "";
    let longestLine = 0;
    for (const word of parsedWords) {
        if (lineAccumulator.length + word.length + 1 > columns) {
            lines.push(lineAccumulator);
            if (lineAccumulator.length > longestLine) {
                longestLine = lineAccumulator.length;
            }
            lineAccumulator = word;
        } else {
            lineAccumulator = lineAccumulator.length
                ? `${lineAccumulator} ${word}`
                : word;
        }
    }

    if (lineAccumulator.length > 0) {
        lines.push(lineAccumulator);
        if (lineAccumulator.length > longestLine) {
            longestLine = lineAccumulator.length;
        }
    }

    let bubble = ` ${"_".repeat(longestLine + 3)}\n`;
    for (let i = 0, limit = lines.length; i < limit; i++) {
        const lineLength = lines[i].length;
        const spacePadding = " ".repeat(longestLine - lineLength + 1);
        if (limit === 1) {
            bubble += `< ${lines[i]}${spacePadding} >\n`;
        } else if (i === 0) {
            bubble += `/ ${lines[i]}${spacePadding} \\\n`;
        } else if (i === limit - 1) {
            bubble += `\\ ${lines[i]}${spacePadding} /\n`;
        } else {
            bubble += `| ${lines[i]}${spacePadding} |\n`;
        }
    }
    bubble += ` ${"-".repeat(longestLine + 3)}\n`;

    return bubble;
};

console.log(
    generateCowsay(
        `I'm having a surprisingly hard time finding an answer to this. With plain Node.JS, you can run any js file with node path/to/file.js, with CoffeeScript it's coffee hello.coffee and ES6 has babel-node hello.js. How do I do the same with Typescript? My project has a tsconfig.json which is used by Webpack/ts-loader to build a nice little bundle for the browser. I have a need for a build step run from the console before that, though, that would use some of the .ts files used in the project to generate a schema, but I can't seem to be able to run a single Typescript file without compiling the whole project. `
    )
);
