import ScriptConfig from './config.json' with { type: 'json'};
import { 
    ButtonStyle,
    ButtonBuilder,
    Events,
    Client,
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    FileUploadBuilder
 } from 'discord.js';

class reportForm{
    
    /**
     * @typedef {Object} optionObject
     * @property {string} label - Etiqueta de la opción.
     * @property {string} description - Descripción corta de la opción.
     * @property {string} value - Valor de la opción.
     */

    /**
     * @type {optionObject[]}
     */
    static #reportOptions = [];

    /**
     * Obtener objeto de discord modal para el sistema de reportes.
     * @returns {ModalBuilder}
     */
    static getDiscordReportForm(){
        const form = new ModalBuilder()
            .setTitle(ScriptConfig.reportForm.title)
            .setCustomId(ScriptConfig.reportForm.id);

        const titleInput = new TextInputBuilder()
            .setCustomId(ScriptConfig.reportForm.id)
            .setStyle(TextInputStyle.Short)
            .setPlaceholder(ScriptConfig.reportForm.inputTitle.placeholder)
            .setRequired(true)

        const titleLabel = new LabelBuilder()
            .setLabel(ScriptConfig.reportForm.inputTitle.label)
            .setTextInputComponent(titleInput);

        form.addLabelComponents(titleLabel);

        if(this.#reportOptions.length){
            const typeReportMenuSelect = new StringSelectMenuBuilder()
                .setCustomId(ScriptConfig.reportForm.menuStringOption.id)
                .setPlaceholder(ScriptConfig.reportForm.menuStringOption.placeholder)
                .setRequired(true)
                .addOptions(
                    this.#reportOptions.map(x=>{

                        const option = new StringSelectMenuOptionBuilder()
                        .setLabel(x.label)
                        .setValue(x.value);

                        if(x.description)
                            option.setDescription(x.description);

                        return option; 
                    })
                )

            const menuOptionLabel = new LabelBuilder()
                .setLabel(ScriptConfig.reportForm.menuStringOption.label)
                .setStringSelectMenuComponent(typeReportMenuSelect)

            form.addLabelComponents(menuOptionLabel);
            
        }

        const formInput = new TextInputBuilder()
            .setCustomId(ScriptConfig.reportForm.inputForm.id)
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder(ScriptConfig.reportForm.inputForm.placeholder)
            .setRequired(true)
        
        const formInputLabel = new LabelBuilder()
            .setLabel(ScriptConfig.reportForm.inputForm.label)
            .setTextInputComponent(formInput);

        form.addLabelComponents(formInputLabel);

        const fileUpload = new FileUploadBuilder()
            .setCustomId(ScriptConfig.reportForm.fileUpload.id)
            .setMaxValues(ScriptConfig.reportForm.fileUpload.maxFiles)
            .setRequired(false);

        const fileUploadLabel = new LabelBuilder()
            .setLabel(ScriptConfig.reportForm.fileUpload.label)
            .setDescription(ScriptConfig.reportForm.fileUpload.description)
            .setFileUploadComponent(fileUpload);

        form.addLabelComponents(fileUploadLabel);

        return form;
    }

    /**
     * Agregar tipos de reporte en opcines de la forma.
     * @param {...optionObject} options - Lista de opciones a agregar.
     */
    static addReportOption(...options) {
        for(const option of options){
            
            if(typeof option.label != 'string')
                throw Error(ScriptConfig.Error.NOT_GETTED_STRING);
            if(option.label.length < ScriptConfig.reportForm.menuStringOption.minCharts)
                throw Error(ScriptConfig.Error.MIN_CHAR_LENGTH);
            if(option.label.length > ScriptConfig.reportForm.menuStringOption.maxCharts)
                throw Error(ScriptConfig.Error.MAX_CHAR_LENGTH);

            if(typeof option.value != 'string')
                throw Error(ScriptConfig.Error.NOT_GETTED_STRING);
            if(option.value.length < ScriptConfig.reportForm.menuStringOption.minCharts)
                throw Error(ScriptConfig.Error.MIN_CHAR_LENGTH);
            if(option.value.length > ScriptConfig.reportForm.menuStringOption.maxCharts)
                throw Error(ScriptConfig.Error.MAX_CHAR_LENGTH);

            if(option.description !== undefined){
                if(typeof option.value != 'string')
                    throw Error(ScriptConfig.Error.NOT_GETTED_STRING);
                if(option.value.length < ScriptConfig.reportForm.menuStringOption.minCharts)
                    throw Error(ScriptConfig.Error.MIN_CHAR_LENGTH);
                if(option.value.length > ScriptConfig.reportForm.menuStringOption.maxCharts)
                    throw Error(ScriptConfig.Error.MAX_CHAR_LENGTH);
            }

            this.#reportOptions.push(option);

        }
    }
}

/**
 * @todo Desarrollar
 */
class reportFormLogBuilder {

    reportFormBuilder(){

    }

}

class Report {

    static #clientSet = false;
    static #reportFormHandlers = [];

    /**
     * Manejar interacciones de el systema de reportes.
     * @param {import('discord.js').Interaction} interaction 
     */
    static #ReportInteractionHandler(interaction){
        if(interaction.isButton()){
            if(interaction.customId == ScriptConfig.ButtonReportID){
                interaction.showModal(reportForm.getDiscordReportForm());
            }
        }
        if(interaction.isModalSubmit()){
            if(interaction.customId == ScriptConfig.FormReportSystemID){
                for(const handlers of this.#reportFormHandlers)
                    handlers();
            }
        }
    }

    /**
     * Menajer envios de formularios de reporte.
     * @param {()=>reportFormLogBuilder} callback 
     */
    static setFormReportHandler(callback){
        if(typeof callback != 'function')
            throw Error(ScriptConfig.Error.NOT_GETTED_FUNCTION);
        this.#reportFormHandlers.push(callback);
    }

    /**
     * Entregar el cliente instanciado de la aplicacion para establecer el handler
     * de interaccion de el sistema de reportes.
     * @param {import('discord.js').Client} client 
     */
    static setClient(client){

        if(this.#clientSet)
            throw Error(ScriptConfig.Error.CLIENT_SETED);

        if(!(client instanceof Client))
            throw Error(ScriptConfig.Error.NOT_INSTANCED_CLIENT);

        client.on(Events.InteractionCreate, this.#ReportInteractionHandler);

        this.#clientSet = true;
    }

    /**
     * Obtener boton que tiene un evento el cual permite a los usuarios reportar.
     * @param {string} label - Frase que describa lo que se esta reportando. 
     * @returns {ButtonBuilder} Boton de discord.
     */
    static getButton(label){
        if(typeof label != 'string')
            throw Error(ScriptConfig.Error.NOT_GETTED_STRING);

        return  new ButtonBuilder()
                .setCustomId(ScriptConfig.ButtonReportID)
                .setLabel(`Reportar: ${label}`)
                .setEmoji(ScriptConfig.Representations.emoji)
                .setStyle(ButtonStyle.Danger);
    }

}

export { Report, reportForm }