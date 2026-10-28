import {Prefix} from '../../AppLibs/Prefix/main.js';
import { SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import { discordReport } from '../../AppLibs/discordReport/main.js';

const command = () => {
    const Row = new ActionRowBuilder().addComponents(discordReport.getButton('Prueba'));
    return {components:[Row]}
}

Prefix.add(prefix =>
    prefix
    .setName('test')
    .setPermission('Admin')
    .setCallback((a,b)=>{
        b.reply(command());
    })
);

const slashCommand = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Pruebas'),
    execute: async (interaction)=>{
        interaction.reply(command());
    }
}

export { slashCommand }