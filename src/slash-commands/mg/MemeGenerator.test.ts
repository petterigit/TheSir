import { generateMeme, MemeOptions } from "./MemeGenerator";
import * as fs from "fs";
import path from "path";

test("generates drake meme", async () => {
    const memeOptions: MemeOptions = {
        name: "drake",
        type: "SUB_COMMAND",
        options: [
            {
                name: "nah",
                type: "STRING",
                value: "Pelaa pelei",
            },
            {
                name: "yes",
                type: "STRING",
                value: "Tee random meme-generaattoria jota kukaan ei pyytänyt",
            },
        ],
    };
    const meme = await generateMeme(memeOptions);
    fs.writeFileSync(path.join(process.cwd(), "src/test/drakeTest.jpg"), meme);
});

test("generates puh meme", async () => {
    const memeOptions: MemeOptions = {
        name: "puh",
        type: "SUB_COMMAND",
        options: [
            {
                name: "lame",
                type: "STRING",
                value: "Pelaa pelei",
            },
            {
                name: "fancy",
                type: "STRING",
                value: "Tee paskaa meme-generaattoria",
            },
        ],
    };
    const meme = await generateMeme(memeOptions);
    fs.writeFileSync(path.join(process.cwd(), "src/test/puhiTest.jpg"), meme);
});
