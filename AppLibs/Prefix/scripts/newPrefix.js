//Constructor para armar sub prefijos.
class subPrefixContruct{

    #name;
    #description;

    /**
     * (Obrigatorio): Establecer nombre de un subprefijo.
     * @param {string} name Nombre de el subprefijo.
     * @returns {this}
     * @throws Tira error si: El nombre esta vacio.
     */
    setName(name){
        if(typeof name != 'string'||name == '')
            throw Error("El nombre del prefijo no es de tipo 'string' valido.");
        this.#name = name;
        return this;
    }

    /**
     * (Opcional): Establecer la descripción de el subprefijo.
     * @param {string} description Descripcion de el subprefijo.
     * @returns {this}
     */
    setDescription(description){
        if(typeof description != 'string')
            throw Error("El metodo 'setDescription' no recibio un valor de tipo 'string'.");
        this.#description = description;
        return this;
    }

    /**
     * Obtener nombre declarado.
     * @returns {string} Nombre de el subprefijo.
     */
    getName(){
        return this.#name;
    }

    /**
     * Obtener nombre declarado.
     * @returns {string} Descripcion de el subprefijo.
     */
    getDescription(){
        return this.#description;
    }

}

/*
    Contructor para armar prefijos main.

    Este es el objeto del prefijo principal, este es el que se tomara
    en cuenta primero al momento de llamar un prefijo, este cargara con el trabajo
    de portar todos los sub prefijos y exportar la ruta de memoria en la que se almacenan.
*/
class PrefixConstruct{

    //Valores privados
    #name;
    #description;
    #callback;
    #permission;
    #subPrefixGroup = [];

    /**
     * (Obligatorio): Metodo para declarar el nombre de el sub prefijo.
     * @param {string} name Nombre de el prefijo. 
     * @returns {this}
     * @throws Tira error si: El nombre esta vacio.
     */
    setName(name){
        if(typeof name != 'string'||name == '')
            throw Error("El nombre del prefijo no es de tipo 'string' valido.");
        this.#name = name;
        return this;
    }

    /**
     * @typedef {Object} Prefix
     * @property {string} name Nombre de el prefijo.
     * @property {string[]} vals Parametros de el prefijo.
     */
    /**
     * @typedef {Object} PrefixMethoded
     * @property {()=>Prefix} getMainPrefix Obtener el nombre y los para metros de el subprefijo.
     * @property {(string)=>Prefix} getSubPrefix Obtener subPrefijo usado.
     */
    /**
     * (Obligatorio): Funcion que sera llamada cuando el prefijo sea llamado.
     * @param {(vals: PrefixMethoded, event: import('discord.js').Message)=>void} callback Funcion ejecutada por el prefijo.
     * @returns {this}
     */
    setCallback(callback){
        if(typeof callback != 'function')
            throw Error("El callback del prefijo no es una funcion.");
        this.#callback = callback;
        return this;
    }

    /**
     * (Opcional): Establecer una descripcion de el prefijo para definir sus funciones.
     * @param {string} description Descripcion de el prefijo.
     * @returns {this}
     */
    setDescription(description){
        if(typeof description != 'string')
            throw Error("El metodo 'setDescription' no recibio un valor de tipo 'string'.");
        this.#description = description;
        return this;
    }

    /**
     * (Obligatorio): Establecer que permiso es requerido para el uso de el prefijo.
     * @param {"User"|"Admin"} permission Tipo de permiso de usuario.
     * @returns {this}
     */
    setPermission(permission){
        if(permission != 'User' && permission != 'Admin')
            throw Error(`El permiso del prefijo debe ser 'User' o 'Admin', se recibio '${permission}'.`);
        this.#permission = permission;
        return this;
    }

    /**
     * (Opcional): Añade un subprefijo al prefijo principal.
     * @param {(subPrefix:subPrefixContruct)=>subPrefixContruct} edit Callback para crear un subprefijo.
     * @returns {this}
     */
    addSubPrefix(edit){
        if(typeof edit != 'function')
            throw Error("No se recibio una funcion en el metodo 'addSubPrefix'.");

        //Enviar objeto para declarar metodos
        let getSubPrefix = edit(new subPrefixContruct());

        //Verificar si se devolvio el subprefijo
        if(!(getSubPrefix instanceof subPrefixContruct))
            throw Error("No se retorno el objeto del metodo 'addSubPrefix'.")

        if(typeof getSubPrefix.getName() != 'string')
            throw Error("El subprefijo no tiene nombre.")

        //Verificar que el subprefijo no tenga un nombre repetido
        if(this.#subPrefixGroup.find(x=>x.name == getSubPrefix.name) || getSubPrefix.name == this.#name)
            throw Error("No se puede repetir los nombres en el prefijo.");

        this.#subPrefixGroup[this.#subPrefixGroup.length] = getSubPrefix;
        
        return this;
    }

    /**
     * Obtener el nombre establecido del prefijo.
     * @returns {string} Nombre de el prefijo.
     */
    getName(){
        return this.#name;
    }

    /**
     * Obtener descripción de el prefijo.
     * @returns {string} Descripción de el prefijo.
     */
    getDescription(){
        return this.#description;
    }

    /**
     * Obtener callback declarada en el prefijo.
     * @returns {(...any)=>any} Callback de el prefijo.
     */
    getCallback(){
        return this.#callback;
    }

    /**
     * Obtener todos los subprefijos insertados al prefijo principa
     * @returns {subPrefixContruct[]} Subprefijos insertados al prefijo principal.
     */
    getSubPrefixGroup(){
        return this.#subPrefixGroup;
    }

    /**
     * Obtener el tipo de permiso de el prefijo.
     * @returns {string} Tipo de permiso de el prefijo.
     */
    getPermission(){
        return this.#permission;
    }

    /**
     * NO USAR. Este metodo ya es usado por default, usarlo denuevo llevara a errores.
     * Se encagar de llamar al callback de el prefijo.
     * @param {PrefixMethoded} vals Objeto que se encarga de la estructura de los parametros de el prefijo.
     * @param {import('discord.js').Message} event Mensaje de discord que llamo al prefijo.
     */
    execute(vals, event){
        this.#callback(vals, event);
    }

}

export {PrefixConstruct};