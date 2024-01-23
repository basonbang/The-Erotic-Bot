import * as dotenv from 'dotenv';
import { Client, Collection, REST, Routes } from 'discord.js';
import { help as helpCommand} from './commands/help.js';
import { info as infoCommand} from './commands/info.js';

dotenv.config();

// Store commands in a Collection 
const commands = new Collection();
const commandData = [infoCommand.data, helpCommand.data];

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

const client = new Client({
  intents: ['Guilds', 'GuildMessages', 'GuildMembers', 'MessageContent']
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
      console.log(error);
      await interaction.reply( {content: 'There was an error executing this command!', ephemeral: true})
    }
  }
});

client.login(process.env.TOKEN);