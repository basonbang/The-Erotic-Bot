import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../types';

export const infoCommand: Command = {
  data : {
    name: 'info',
    description: 'Get information about your user and the server.'
  },
  execute: async (interaction: CommandInteraction) => {
    const member = interaction.member as GuildMember;  // GuildMember object
    const user = interaction.user;    // User object

    const guild = interaction.guild;    // Server (guild) information

    const infoMessage = [
      `**User Information**`,
      `Username: ${user.username}`,
      `ID: ${user.id}`,
      `Avatar URL: ${user.displayAvatarURL()}`,
      `Server Join Date: ${member.joinedAt?.toDateString()}`,
      ``,
      `**Server Information**`,
      `Server Name: ${guild?.name}`,
      `Total Members: ${guild?.memberCount}`,
      `Creation Date: ${guild?.createdAt.toDateString()}`,
      `Server ID: ${guild?.id}`
    ].join(`\n`);

    await interaction.reply(infoMessage);
  }
};