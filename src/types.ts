import { CommandInteraction } from "discord.js";

// Defines structure for choices within slash command options
export interface CommandOptionChoice {
  name: string;
  value: string | number;
}

// Defines structure for options that command might have
export interface CommandOption {
  type: string;
  name: string;
  description: string;
  required?: boolean;
  choices?: CommandOptionChoice[];
  options?: CommandOption[]; // For subcommands and subcommand groups
}

// Overall structure of command data
export interface CommandData {
  name: string;
  description: string;
  options?: CommandOption[];
}

export interface Command {
  data: CommandData;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
