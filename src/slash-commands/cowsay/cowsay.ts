const cow = `\
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;

export const generateCowsay = (message: string, columns = 40) => {
    let bubble = generateBubble(message, columns);
    bubble += cow;
    return bubble;
};

const generateBubble = (message: string, columns: number) => {
    const parsedMessage = message.replace(/\n/g, " ");
    const words = parsedMessage.split(" ");
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

    let bubble = ` ${"_".repeat(longestLine + 2)}\n`;
    for (let i = 0, limit = lines.length; i < limit; i++) {
        const lineLength = lines[i].length;
        const spacePadding = " ".repeat(longestLine - lineLength);
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
    bubble += ` ${"-".repeat(longestLine + 2)}\n`;

    return bubble;
};
