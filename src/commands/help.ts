import { CommandInteraction } from "discord.js"

export const help = {
  data: {
    name: 'help',
    description: 'List all available commands!'
  },
  async execute(interaction: CommandInteraction){
    const helpMessage = [
      `Here are the available commands!`,
      `/info - Provide information about the user and the server`,
      `/help - Displays this message`
    ].join('\n');

    await interaction.reply(helpMessage);
  }
}