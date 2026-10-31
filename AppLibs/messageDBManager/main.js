class messageDBManager {
    
    /**
     * @typedef {Object} identificatorsOBJ
     * @property {number} ID ID de el mensaje en la base de datos.
     * @property {string} guildID ID de servidor.
     * @property {messageID} messageID ID de mensaje de discord.
     */

    /**
     * Armar base de datos con la cual trabaja la libreria.
     * @param {string} dir direccion en dodne se creara la base de datos.
     */
    static #BUILD_MESSAGE_DATABASE(dir) {

    }

    /**
     * Eliminar mensaje de la base de datos.
     * @param {identificatorsOBJ} identificators 
     */
    static async delete(identificators){

    }
 
    static get(identificators){

    }

    static async add(discordMessage, dataFill){

    }

}

export {messageDBManager}
