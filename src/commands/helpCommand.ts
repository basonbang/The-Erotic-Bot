import { CommandInteraction } from "discord.js"
import { Command } from "../types";

export const helpCommand: Command = {
  data: {
    name: 'help',
    description: 'List all available commands!'
  },
  execute: async (interaction: CommandInteraction) => {
    const helpMessage = [
      `Here are the available commands!`,
      `/info - Provide information about the user and the server`,
      `/help - Displays this message`,
      `/play - Plays an inputted Youtube link`
    ].join('\n');

    await interaction.reply(helpMessage);
  }
}