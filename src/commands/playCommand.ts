import { CacheType, CommandInteraction, CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { Command } from "../types";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import * as ytdl from "ytdl-core";

export const playCommand: Command = {
  data: {
    name: 'play',
    description: 'Play audio from any Youtube link!',
    options: [
      {
        name: 'url',
        type: 'STRING',
        description: 'URL of the Youtube video to play',
        required: true
      }
    ]
  },
  execute: async (interaction: CommandInteraction<CacheType> ) => {

    // Assume this is Youtube link that is passed by bro
    const options = interaction.options as CommandInteractionOptionResolver<CacheType>
    const url = options.getString('url');

    // Check if the URL is a valid YouTube link or not
    if (!url || !ytdl.validateURL(url)){
      await interaction.reply({content: "Please provide a valid YouTube link!"});
      return;
    }

    // Allow bot to join user's voice channel, if they're in one
    if (!interaction.guild){  
      await interaction.reply({content: "This command can only be used in a server!"});
      return;
    }

    if (!(interaction.member instanceof GuildMember)){  // assert that bro is of type GuildMember 
      await interaction.reply({content: 'How are you even calling this when you\'re not part of the server?!'});
      return;
    } 

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({content: 'You need to be in a voice channel to use this command!'})
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    // Create audio resource and player
    const stream = ytdl(url, { filter: 'audioonly'});
    const audioResource = createAudioResource(stream);
    const player = createAudioPlayer();

    // Audio player plays audio until it's finished!
    
  }
}