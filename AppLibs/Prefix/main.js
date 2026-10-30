import { PrefixConstruct } from './scripts/newPrefix.js';
import { ResolvePrefix } from './scripts/ResolvePrefix.js';

class PrefixManager{

    //Valores Privados
    #caller;

    /**@type {PrefixConstruct[]}  */
    #prefixes=[];

    constructor(caller){
        if(typeof caller != 'string')
            throw Error(db.ErrorType.notGetted['string']);
    
        this.#caller = caller;
    }

    /*
        Funcion para añadir un objeto 'Prefix' a la lista de prefijos 'Admin' o 'User'.
        'Admin' son prefijos que solo pueden ejecutar usuarios con permisos de administrador.
        'User' son prefijos que pueden ejecutar usuarios sin necesidad de permisos.

        Corrobora que todos los prefijos tengan nombre declarado y que el main prefix tenga
        callback.
    */
    /**
     * Añadir prefijos.
     * @param {(prefix: PrefixConstruct) => PrefixConstruct} PrefixBuild Objeto intanciado de el prefijo.
     * @throws Tira error si no se usaron los metodos obligatorios.
     * @example
     * Prefix.add(
     *     prefix => prefix
     *     //(Obligatorio): Declaramos el nombre por el cual sera llamado.
     *     .setName("Example")
     *     //(Obligatorio): Declaramos el callback que sera ejecutado cuando este sea llamado y el cual recibira el evento de discord que llamo al subprefijo.
     *     .setCallback((event)=>{})
     *     //(Opcional): Declaramos descripcion del prefijo.
     *     .setDescription("Prefijo de ejemplo.")
     *     //Declaramos un subprefijo, un grupo de valores que puede ser usado para ciertas funciones. Esto puede ser usado mas de una vez. (Opcional)
     *     .addSubPrefix(x=>x
     *         //Declarar nombre del sub-prefijo. (Obligatorio)
     *         .setName("Test")
     *         //Declarar descripcion del sub-prefijo (Opcional)
     *         .setDescription("Subprefijo de la prueba.")
     *     )
     *     //Declara que permisos necesita el usuario para usar el prefijo. (Obligatorio)
     *     //Se puede usar 'User' para que lo pueda usar cualquiera, o 'Admin' para limitarlo a personas con permisos administrativos.
     *     .setPermission('User')
     * );
     */
    add(PrefixBuild){

        let PrefixObj = PrefixBuild(new PrefixConstruct());

        //Verificamos que lo recibido es el objeto adecuado
        if(!(PrefixObj instanceof PrefixConstruct))
            throw Error("Lo recibido no es un objeto 'BuildPrefix'.");

        //Verificar que todos los prefijos tengan nombre
        if(PrefixObj.getName() == undefined)
            throw Error("Un prefijo no tiene nombre.");

        //Verificar la existencia del callback
        if(!PrefixObj.getCallback())
            throw Error("El prefijo principal no tiene 'callback'.")

        //Verificar si tiene permisos de uso
        if(!PrefixObj.getPermission())
            throw Error("El prefijo carece de permisos que indiquen sus permisos de uso.");

        this.#prefixes.push(PrefixObj);

    }

    /**
     * SOLO USAR UNA VEZ. Metodo encargado de recibir los mensajes de discord y procesarlos para detectar prefijos.
     * Re usar este metodo puede causar errores de duplicados de llamadas.
     * @param {import('discord.js').Message} message Mensaje de discord.
     * @returns {Promise<void>}
     */
    async call(message){
        //Procesamos el contenido del mensaje
        let command = message.content.split(' ').filter(x=>x);

        //Verificamos si se trata del main Prefix, si no es interrumpios ejecucion.
        if(command[0] != this.#caller)
            return;

        //Buscamos el prefijo
        let getPrefix = this.#prefixes.find(x => x.getName() == command[1]); 

        //Verificamos si se consiguio un prefijo de lo contrario interrumpir
        if(!getPrefix){
            message.reply(`No existe el prefijo "${command[1]}".`);
            return;
        }

        /*
            Verificamos si es un prefijo de permiso administrador y si es verificamos los
            permisos del usuario. Si el usuario no tiene permisos de administrador interumpimos.
        */
        //Verificamos si es un prefijo y los permisos del usuario. A la vez declaramos el valor a 'getPrefix'.
        if(getPrefix.getPermission() == 'Admin'){
            if(!message.member.permissions.has('Administrator')){
                 return;
            }
        }

        ResolvePrefix(getPrefix, command, message);

    }

    /**
     * Elimina un prefijo registrado.
     * @param {string} name Nombre de el prefijo.
     */
    remove(name){

        //Verificar que el nombre introducido sea tipo 'string'
        if(typeof name != 'string')
            throw Error("El valor introducido en el metodo 'remove' no es valido.");

        //Entregar todo el array con los prefijos sin el que tiene el nombre.
        this.#prefixes = this.#prefixes.filter(x=>x.name!=name);

    }

    /**
     * Busca la existencia de un prefijo con el nombre introducido
     * @param {string} name Nombre de el prefijo.
     * @returns {boolean} Devuelve 'true' o 'false' si existe o no.
     */
    check(name){

        //Verificar que el nombre introducido sea tipo 'string'
        if(typeof name != 'string')
            throw Error("El valor introducido en el metodo 'check' no es valido.");

        //Buscar la exitencia del prefijo
        if(this.#prefixes.find(x=>x.name==name))
            return true;
        return false;

    }

}

export { PrefixManager };