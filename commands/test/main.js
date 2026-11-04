import { appPrefix } from '../../scripts/prefixHandler/main.js';
import { SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import { Report } from '@dm-staff/report';
import { db } from '../../scripts/dataBaseLoader/main.js';

const command = () => {
    const Row = new ActionRowBuilder().addComponents(Report.getButton('Prueba'));
    return {components:[Row]}
}

appPrefix.add(prefix =>
    prefix
    .setName('test')
    .setPermission('Admin')
    .setCallback((a,b)=>{
        console.log("Ejecucion:");

        db.messages.get({id:1})[0].fetchMessage().then(x=>console.log(x));

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