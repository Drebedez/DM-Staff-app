import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { ReportForm } from '@dm-staff/report';
import ScriptConfig from './config.json' with { type:'json' };

const slashCommand = {
    data: new SlashCommandBuilder()
    .setName(ScriptConfig.command.name)
    .setDescription(ScriptConfig.command.description)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (/**@type {import('discord.js').ChatInputCommandInteraction} */interaction)=>{
        interaction.showModal(ReportForm.getDiscordReportForm());
    }
}

export { slashCommand }