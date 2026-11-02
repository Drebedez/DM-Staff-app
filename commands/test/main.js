import {Prefix} from '../../scripts/prefixHandler/main.js';
import { SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import { Report, reportForm } from '../../AppLibs/Report/main.js';
import { db } from '../../scripts/dataBaseLoader/main.js';
import { messageDBManager } from '../../AppLibs/messageDBManager/main.js';
import path from 'node:path';

const command = () => {
    const Row = new ActionRowBuilder().addComponents(Report.getButton('Prueba'));
    return {components:[Row]}
}

Prefix.add(prefix =>
    prefix
    .setName('test')
    .setPermission('Admin')
    .setCallback((a,b)=>{
        messageDBManager.createDefaultDB(path.join(import.meta.dirname, '../../data/sqlite/'), NaN)
        b.reply("Prueba ejecutada.");
    })
);

const slashCommand = {
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Pruebas'),
    execute: async (interaction)=>{
        // messageDBManager.createDefaultDB(path)
        interaction.reply(command());
    }
}

export { slashCommand }