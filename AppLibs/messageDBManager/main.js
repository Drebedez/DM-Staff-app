import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

/**
 * Crear una instancia de los mensajes en la base de datos para poder administrarlos.
 */
class messageData {

    #DATABASE;

    /**
     * 
     * @param {Object} messageDB 
     * @param {Database} db 
     */
    constructor(messageDB, db){
        this.#DATABASE = db;
    }

}

class messageDBManager {
    
    /**
     * @typedef {Object} messagesIDs
     * @property {number} ID ID de el mensaje en la base de datos.
     * @property {string} guildID ID de servidor.
     * @property {messageID} messageID ID de mensaje de discord.
     */

    #DATABASE;

    constructor(dir){

        try{
            new Database(dir, {readonly: true});
        } catch(e) {
            throw Error(`Error en la verificacion de la ruta de la base de datos:\n${e}`);
        }

        this.#DATABASE = new Database(dir);

    }

    /**
     * Usar el metodo close de better-sql para cerrar la base de datos.
     */
    close(){
        this.#DATABASE.close();
    }

    /**
     * @todo
     * Armar base de datos con la cual trabaja la libreria.
     * @param {string} dir direccion en dodne se creara la base de datos.
     */
    static createMessageDB(dir) {
        
    }

    /**
     * Eliminar mensaje de la base de datos.
     * @param {messagesIDs} messagesIDs
     * @param {boolean} DELETEALL Este parametro se establece true si la orden es borrar toda la base de datos.
     */
    async delete(messagesIDs, DELETEALL = false){

        messagesIDs ??= {};

        if(messagesIDs === null || typeof messagesIDs != 'object')
            throw Error('Error: No se recibio un objeto.');

        if(messagesIDs.ID !== undefined && typeof messagesIDs.ID != 'string')
            throw Error('Error: No se recibio un tipo de valor valido.');
        if(messagesIDs.guildID !== undefined && typeof messagesIDs.guildID != 'string')
            throw Error('Error: No se recibio un tipo de valor valido.');
        if(messagesIDs.messageID !== undefined && typeof messagesIDs.messageID != 'string')
            throw Error('Error: No se recibio un tipo de valor valido.');

        if(typeof DELETEALL != 'boolean')
            throw Error('Error: No se recibio un booleano.');

        if(!DELETEALL && (
            !messagesIDs.ID &&
            !messagesIDs.guildID &&
            !messagesIDs.messageID
        )) throw Error('Error: No se recibio ningun filtro para eliminacion o la confirmacion de la eliminacion total de la base de datos.');

        try {
            this.#DATABASE.prepare(`
                    DELETE
                    FROM message
                    WHERE
                    (? IS NULL OR id = ?)
                    AND (? IS NULL OR guild_id = ?)
                    AND (? IS NULL OR message_id = ?);
                    `).run([
                        messagesIDs.ID,
                        messagesIDs.ID,
                        messagesIDs.guildID,
                        messagesIDs.guildID,
                        messagesIDs.messageID,
                        messagesIDs.messageID
                    ]);
        } catch (e) {
            throw Error(`Error: En la eliminacion de la base de datos:\n${e}`);
        }
    }
 
    /**
     * Obten todos los mensajes de la base de datos de 
     * @param {messagesIDs} messagesIDs 
     * @returns {messageData[]}
     */
    get(messagesIDs){

        messagesIDs ??= {};

        if(messagesIDs === null || typeof messagesIDs != 'object')
            throw Error('Error: No se recibio un objeto.');

        if(messagesIDs.ID !== undefined && typeof messagesIDs.ID != 'string')
            throw Error('Error: No se recibio un tipo de valor valido.');
        if(messagesIDs.guildID !== undefined && typeof messagesIDs.guildID != 'string')
            throw Error('Error: No se recibio un tipo de valor valido.');
        if(messagesIDs.messageID !== undefined && typeof messagesIDs.messageID != 'string')
            throw Error('Error: No se recibio un tipo de valor valido.');

        let query;
        try {
            query = this.#DATABASE.prepare(`
                SELECT id, guild_id, message_id, data, auto_delete
                FROM message
                WHERE
                (? IS NULL OR id = ?)
                AND (? IS NULL OR guild_id = ?)
                AND (? IS NULL OR message_id = ?);
                `, {raw: true},).all([
                    messagesIDs.ID,
                    messagesIDs.ID,
                    messagesIDs.guildID,
                    messagesIDs.guildID,
                    messagesIDs.messageID,
                    messagesIDs.messageID
                ])?.map(x=> new messageData(x, this.#DATABASE));
        } catch (e) {
            throw Error(`Error: No se pudo consultar correctamente la base de datos.\n${e}`);
        }
    
        return query ?? null;
    }

    async add(discordMessage, dataFill){

    }

}

export {messageDBManager}
