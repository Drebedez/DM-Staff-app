import {Prefix} from '../../scripts/prefixHandler/main.js';
import { SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import { Report, reportForm } from '../../AppLibs/Report/main.js';
import { db } from '../../scripts/dataBaseLoader/main.js';

const command = () => {
    const Row = new ActionRowBuilder().addComponents(Report.getButton('Prueba'));
    return {components:[Row]}
}

Prefix.add(prefix =>
    prefix
    .setName('test')
    .setPermission('Admin')
    .setCallback((a,b)=>{
        db.messages.delete(null, true);
        b.reply("Prueba ejecutada.");
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