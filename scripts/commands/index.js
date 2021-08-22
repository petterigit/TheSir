const filterUnique = (commands) => {
  return commands.reduce((uniqueCommands, command) => {
    if (
      !uniqueCommands.find(
        (uniqueCommand) => uniqueCommand.execute === command.execute
      )
    ) {
      uniqueCommands.push(command);
    }
    return uniqueCommands;
  }, []);
};

const replyCommands = async (message, client) => {
  try {
    const commands = filterUnique(client.commands);
    const embed = {
      title: "Available commands:",
      fields: commands.map((command) => ({
        name: Array.isArray(command.data.name)
          ? command.data.name.join(", ")
          : command.data.name,
        value: command.data.description,
      })),
    };
    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  data: {
    name: ["commands", "help", "tasukete", "助けて"],
    description: "Lists all commands",
  },
  async execute(message, client) {
    await replyCommands(message, client);
  },
};
