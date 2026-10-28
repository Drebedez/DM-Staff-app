import ScriptConfig from '../config.json' with { type:'json' };
import { ModalBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

const reportOptions = [];

const getDiscordReportForm = () => {
    const form = new ModalBuilder()
        .setTitle(ScriptConfig.reportForm.title)
        .setCustomId(ScriptConfig.reportForm.id);

    const titleInput = new TextInputBuilder()
        .setCustomId(ScriptConfig.reportForm.id)
        .setStyle(TextInputStyle.Short)
        .setPlaceholder(ScriptConfig.reportForm.inputTitle.placeholder)

    const titleLabel = new LabelBuilder()
        .setLabel(ScriptConfig.reportForm.inputTitle.label)
        .setDescription(ScriptConfig.reportForm.inputTitle.description)
        .setTextInputComponent(titleInput);

    form.addLabelComponents(titleLabel);

    if(reportOptions.length){
        const typeReportMenuSelect = new StringSelectMenuBuilder()
            .setCustomId()
            .setPlaceholder()
            .setRequired()
            .addOptions(
                reportOptions.map(x=>{
                    return new StringSelectMenuOptionBuilder()
                    .setLabel(x.label)
                    .setDescription(x.description)
                    .setValue(x.value)
                })
            )

        form.addLabelComponents(typeReportMenuSelect);
        
    }
    
    return form;
}

/**
 * @typedef {Object} optionObject
 * @property {string} label - Etiqueta de la opción.
 * @property {string} description - Descripción corta de la opción.
 * @property {string} value - Valor de la opción.
 */

/**
 * Agregar tipos de reporte en opcines de la forma.
 * @param {...optionObject} options - Lista de opciones a agregar.
 */
const addReportOption = (...options) => {
    for(const option of options){
        
        if(typeof option.label != 'string')
            throw Error();
        if(option.label.length < ScriptConfig.reportForm.menuStringOption.minCharts)
            throw Error();
        if(option.label.length > ScriptConfig.reportForm.menuStringOption.maxCharts)
            throw Error();

        if(typeof option.value != 'string')
            throw Error();
        if(option.value.length < ScriptConfig.reportForm.menuStringOption.minCharts)
            throw Error();
        if(option.value.length > ScriptConfig.reportForm.menuStringOption.maxCharts)
            throw Error();

        if(option.description !== undefined){
            if(typeof option.value != 'string')
                throw Error();
            if(option.value.length < ScriptConfig.reportForm.menuStringOption.minCharts)
                throw Error();
            if(option.value.length > ScriptConfig.reportForm.menuStringOption.maxCharts)
                throw Error();
        }

        reportOptions.push(option);

    }
}

class reportFormLogBuilder {
    reportFormBuilder(){

    }
}

export {reportFormLogBuilder,getDiscordReportForm}