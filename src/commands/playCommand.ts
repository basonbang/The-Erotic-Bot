import { ApplicationCommandOptionType, CacheType, CommandInteraction, CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { Command } from "../types";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } from "@discordjs/voice";
import ytdl from "ytdl-core";

export const playCommand: Command = {
  data: {
    name: 'play',
    description: 'Play audio from any Youtube link!',
    options: [{
        name: 'url',
        type: ApplicationCommandOptionType.String,
        description: 'URL of the Youtube video to play',
        required: true
    }]
  },
  execute: async (interaction: CommandInteraction<CacheType> ) => {

    // Assume this is Youtube link that is passed by bro
    const options = interaction.options as CommandInteractionOptionResolver<CacheType>
    const url = options.getString('url');

    // Check if the URL is a valid YouTube link or not
    if (!url || !ytdl.validateURL(url)){
      await interaction.reply({content: "Please provide a valid YouTube link!", ephemeral: true});
      return;
    }

    // Allow bot to join user's voice channel, if they're in one
    if (!interaction.guild){  
      await interaction.reply({content: "This command can only be used in a server!", ephemeral: true});
      return;
    }

    if (!(interaction.member instanceof GuildMember)){  // assert that bro is of type GuildMember 
      await interaction.reply({content: 'How are you even calling this when you\'re not part of the server?!', ephemeral: true});
      return;
    } 

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      await interaction.reply({content: 'You need to be in a voice channel to use this command!', ephemeral: true})
      return;
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // log voice connection status
    console.log(`Voice connection status: ${connection.state.status}`);
    
    const stream = ytdl(url, { filter: 'audioonly', quality:'highestaudio'});
    
    stream.on('info', (info) => {
      console.log(`Starting stream: ${info.videoDetails.title}`);
    })

    stream.on('error', (error) => {
      console.log(`Stream error: ${error.message}`);
    })

    // log when stream starts
    stream.on('start', () => { console.log('Stream has started.');
  })
  
    // Create audio resource and player
    const audioResource = createAudioResource(stream);
    const player = createAudioPlayer();
    
    // Subscribe the connection to the player and log the subscription status
    const subscription = connection.subscribe(player);
    
    if (subscription) {
      console.log('Connection is subscribed to player.');
    } else {
      console.error('Failed to subscribe the connection to the player.');
      // stop playing audio after 5 seconds
      setTimeout(() => subscription!.unsubscribe(), 5_000);
    }

    // Log audio player status
    console.log(`Audio player state: ${player.state.status}`);

    // Audio player plays audio until it's finished!
    player.play(audioResource);

    player.on(AudioPlayerStatus.Playing, async () => {
      console.log('Audio is now in the playing state.');
      await interaction.reply('Now playing!');
    })

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('The audio has finished playing.');
      connection.destroy(); // Leave voice channel when playback stops
    })

    player.on('error', error => {
      console.error(`Error: ${error.message}`);
    });

  }
}