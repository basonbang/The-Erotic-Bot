import * as dotenv from 'dotenv';
import { Client, Collection, REST, Routes } from 'discord.js';
import { helpCommand } from './commands/helpCommand.js';
import { infoCommand } from './commands/infoCommand.js';
import { playCommand } from './commands/playCommand.js';
import { Command } from './types.js';

dotenv.config();

// Store commands in a Collection 
const commands = new Collection<string, Command>();
const commandData = [infoCommand.data, helpCommand.data, playCommand.data];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN as string);


// Register new commands with Discord
(async () => {
  try {
    console.log('Now registering slash commands...');
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
      { body: commandData}
    )
    console.log('Successfully registered slash commands!');
  
  } catch (error) {
    console.log(`There was an error. ${error}`);
    
  }
})();

// Add command modules to the collection
commands.set(infoCommand.data.name, infoCommand);
commands.set(helpCommand.data.name, helpCommand);
commands.set(playCommand.data.name, playCommand);

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent', 'GuildVoiceStates']
});

client.once('ready', (c) => {
  console.log(`✅ ${c.user.username} is online`);
});

// Handle slash command interactions
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;   // Code below only runs if interaction was a command
  
  const command = commands.get(interaction.commandName);

  console.log(command);

  if (command){
    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(error);                         // Ephemeral: Messages only visible to user who triggered interaction
      await interaction.reply( {content: 'There was an error executing this command!', ephemeral: true}) 
    }
  }
});

client.login(process.env.TOKEN);