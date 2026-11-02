import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

/**
 * Crear una instancia de los mensajes en la base de datos para poder administrarlos.
 */
class messageData {

    /**
     * @typedef {Object} messageFromDataBase
     * @property {number} id
     * @property {string} guild_id
     * @property {string} message_id
     * @property {string} custom_id
     * @property {string|null} data
     * @property {string|null} auto_delete
     */

    //Base de datos a la que pertenece el mensaje.
    #DATABASE;

    #id;
    #guild_id;
    #message_id;
    #custom_id;
    #data;
    #auto_delete;

    /**
     * 
     * @param {messageFromDataBase} messageDB 
     * @param {Database} db 
     */
    constructor(messageDB, db){
        this.#DATABASE = db;
        
        this.#id = messageDB.id;
        this.#guild_id = messageDB.guild_id;
        this.#message_id = messageDB.message_id;
        this.#custom_id = messageDB.custom_id;
        this.#data = messageDB.data;

    }

}

class messageDBManager {
    
    /**
     * @typedef {Object} messagesIDs
     * @property {number} ID ID de el mensaje en la base de datos.
     * @property {string} guildID ID de servidor.
     * @property {string} messageID ID de mensaje de discord.
     * @property {string} customID ID perzonalizado que permite identificar uno o mas mensajes de un tipo.
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
     * Armar base de datos con la cual trabaja la libreria.
     * @param {string} dir Ruta en donde se alojara la nueva base de datos.
     * @param {string} fileName Nombre de la nueva base de datos.
     */
    static createDefaultDB(dir, fileName = 'def_message.db') {

        try{
            if(!fs.statSync(dir).isDirectory())
                throw Error('Error: No se obtuvo una ruta de carpeta.');
        } catch (e) {
            throw Error(`Error: No se pudo obtener la ruta de archivos:\n${e}`);
        }

        if(typeof fileName != 'string')
            throw Error('Error: El nombre de el archivo no es una cadena de texto.');
        if (path.extname(fileName) != '.db')
            throw Error('Error: El nombre de el archivo no posee la extension "db".');

        const newDirFile = path.join(dir, fileName);

        fs.writeFileSync(newDirFile, '');

        new Database(newDirFile).exec(`
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    guild_id TEXT,
                    message_id TEXT,
                    custom_id TEXT,
                    data TEXT,
                    auto_delete TEXT
                );

                CREATE TRIGGER IF NOT EXISTS auto_delete_msg_on_insert
                AFTER INSERT ON messages
                BEGIN
                    DELETE FROM messages 
                    WHERE datetime(delete_date) <= datetime('now');
                END;


                CREATE TRIGGER IF NOT EXISTS auto_delete_msg_on_update
                AFTER UPDATE ON messages
                BEGIN
                    DELETE FROM messages 
                    WHERE datetime(delete_date) <= datetime('now');
                END;
            `);

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
                    AND (? IS NULL OR message_id = ?)
                    AND (? IS NULL OR custom_id = ?);
                    `).run([
                        messagesIDs.ID,
                        messagesIDs.ID,
                        messagesIDs.guildID,
                        messagesIDs.guildID,
                        messagesIDs.messageID,
                        messagesIDs.messageID,
                        messagesIDs.customID,
                        messagesIDs.customID
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
                AND (? IS NULL OR message_id = ?)
                AND (? IS NULL OR custom_id) = ?);
                `, {raw: true}).all([
                    messagesIDs.ID,
                    messagesIDs.ID,
                    messagesIDs.guildID,
                    messagesIDs.guildID,
                    messagesIDs.messageID,
                    messagesIDs.messageID,
                    messagesIDs.customID,
                    messagesIDs.customID
                ])?.map(x=> new messageData(x, this.#DATABASE));
        } catch (e) {
            throw Error(`Error: No se pudo consultar correctamente la base de datos.\n${e}`);
        }
    
        return query ?? null;
    }

    /**
     * 
     * @param {import('discord.js').Message} discordMessage 
     * @param {object|null|undefined} dataFill Objeto que 
     */
    async add(discordMessage, dataFill){
        
    }

}

export {messageDBManager}
