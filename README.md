# TheSir

It's a Discord Bot

Create a pull request and I'll merge

Add command name and file import to Main.js

Add your own code and everything else to your Script Folder

Commands folder can be updated when needed

## Commands

Create new commands in the `commands` folder. Create a folder for each command, and put the `module.exports` in `index.js`. Any other filename will not work. The export should follow the format:

```
module.exports = {
  data: {
    name: ["alias 1", "alias 2"],      // A string for the command name, or a list of strings for multiple aliases
    description: "Some description",   // Description that is shown in help
  },
  async execute(message, client) {
    await handler(message, client);    // Handler is the function you create to deal with the message. Client parameter is optional
  },
};
```

## Interactions

Create interactions in the `interactions` folder. These can include slash commands and button interactions, or any other interactions there might be. Create folder for each interaction and name the file with export as `index.js`. The export should have identical format to command export seen above.

Interaction parameters are handled similarly to commands. Parameters are separated by whitespace. First parameter is the interaction name, rest of the parameters are additional. For an example, look at `sir ruokaa` command and `ruokaa` interaction.
