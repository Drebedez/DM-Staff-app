import { appClient } from '../ClientDiscordInstance/main.js';
import { Collection, Routes, REST, Events } from 'discord.js';
import { Prefix } from '../prefixHandler/main.js';
import fs from 'node:fs';
import path from "node:path";
import APP_ID_DATA from '../../data/json/APP_ID_DATA.json' with {type: 'json'};

//Instancear 'Collection'.
const Commands = new Collection();

//Obtener ruta de archivo donde se encuentran los comandos.
const CommandsDir = path.join(import.meta.filename, '../../../commands');

const files = fs.readdirSync(CommandsDir);

for(const commandfile of files){
    const command = (await import(`../../commands/${commandfile}/main.js`))?.slashCommand;
    if(command?.data)
        Commands.set(command.data.name, command);
}

//Instanciar 'REST'.
const appREST = new REST().setToken(APP_ID_DATA.TOKEN);


//Integrar comandos a los servidores
(async () => {

    try{
        await appREST.put(
            Routes.applicationCommands(APP_ID_DATA.CLIENT_ID),
            {
                body: [
                        ...Commands.map((cmd) => cmd.data?.toJSON()).filter(x=>x)
                    ]
            }
        );
    } catch (e){
        console.log(e);
    }

})();

//Eventos para ejecutar comandos.
appClient.on(Events.InteractionCreate, async (interaction)=>{
    if(interaction.isChatInputCommand() && interaction.inGuild()){
        Commands.get(interaction.commandName).execute(interaction).catch((e)=>{
            return console.error(e);
        });
    }
});

//Evento para ejecutar prefijos.
appClient.on(Events.MessageCreate, async (message)=>{
    Prefix.call(message);
});