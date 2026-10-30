import { SlashCommandBuilder } from "discord.js";
import { Prefix } from "../../scripts/prefixHandler/main.js";
import { translation } from "../../AppLibs/translation/main.js";
import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};
import { textFix } from "../../AppLibs/textRep/main.js";

const translate = new translation(path.join(import.meta.dirname, './lang'));

const command = (lang, number = 20, diceNum = 1 ) => {

    let throwList = [];

    for (let count = 0; count < diceNum; count++){
        throwList.push(
            Math.floor(
                Math.random() * Math.abs(number)
            ) + 1
        )
    }

    const response = textFix.replaceKey(
        translate.get(ScriptConfig.TextsLocationsID.RESULT, lang),
        [
            throwList.map(result=>`[**${result}**]`).join(', ')
        ]
    );

    return response.length > 2000 ? ScriptConfig.limitChartMessage : response;

}

Prefix.add(prefix => 
    prefix
    .setName(ScriptConfig.prefix.name)
    .setDescription(ScriptConfig.prefix.description)
    .setPermission(ScriptConfig.prefix.permission)
    .setCallback( async (prefix,discordMessage) => {
        let getDice = prefix.getMainPrefix().vals[0];

        let throws;
        let value;

        if(getDice !== undefined){

            let getInputs = getDice.split('d');

            throws = getInputs[0];
            value = getInputs[1];

            if(isNaN(throws) || throws % 1 !== 0 || throws == 0){
                discordMessage.channel.send("La cantidad de tiradas no es valida.");
                return;
            }

            if(isNaN(value) || value % 1 !== 0 || value == 0){
                discordMessage.channel.send("La cantidad de tiradas no es valida.");
                return;
            }

        }
        
        discordMessage.reply(command(null, value, throws)).catch(()=>{});;

    })
);

const slashCommand = {
    data: new SlashCommandBuilder()
    .setName(ScriptConfig.command.name)
    .setDescription(ScriptConfig.command.description)
    .addNumberOption( option => 
        option
        .setName(ScriptConfig.command.options.throws.name)
        .setDescription(ScriptConfig.command.options.throws.description)
        .setMinValue(ScriptConfig.command.options.throws.minValue)
    )
    .addNumberOption( option => 
        option
        .setName(ScriptConfig.command.options.value.name)
        .setDescription(ScriptConfig.command.options.value.description)
        .setMinValue(ScriptConfig.command.options.value.minValue)
    ),

    execute: async (/**@type {import('discord.js').ChatInputCommandInteraction} */interaction)=>{
        interaction.reply(
            command(
                interaction.locale.split('-')[0],
                interaction.options.getNumber(ScriptConfig.command.options.value.name) || undefined,
                interaction.options.getNumber(ScriptConfig.command.options.throws.name) || undefined
            )
        ).catch(()=>{});
    }
}

export { slashCommand }