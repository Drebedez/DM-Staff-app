/* 
    Constructor que se envia al callback del main prefix para hacer
    uso de los valores de este.

    Metodos:

    getMainPrefix: Obtiene el nombre y los valores del prefijo principal.

    getSubPrefix: Introduce un valor de tipo 'string' que se usara para buscar
    si el prefijo fue usado y si se introdujeron valores.
*/
class PrefixMethoded{

    #mainPrefix;
    #subPrefixList;

    constructor(PrefixList){
        this.#mainPrefix = PrefixList[0];
        this.#subPrefixList = PrefixList.slice(1);
    }

    /**
     * @typedef {object} Prefijo
     * @param {string} name Nombe de el prefijo
     * @param {any[]} vals Parametros de el prefijo.
     */

    /**
     * Obtener nombre y valores de el prefijo principal.
     * @returns {Prefijo}
     */
    getMainPrefix(){
        return this.#mainPrefix;
    }

    /**
     * Obtener los parametros de un subprefijo.
     * @param {string} name Nombre de el subprefijo.
     * @returns {Prefijo||null} 
     */
    getSubPrefix(name){
        return this.#subPrefixList.find(x=>x.name == name) || null;
    }

}

/* 
    Funcion para resolver prefijos.

    Esta funcion sera llamada siempre por la funcion check del main script,
    esta funcion no esta diseñada para trabajar sin las revisiones realizadas
    con anterioridad de la propia libreria.

    La funcion ira por cada valor del array 'command' primero verificando de que
    sea un prefijo principal o un sub prefijo. Si un sub prefijo es encontredo se
    crea un objeto nuevo que guarda el nombre del sub prefio econtrado y un array
    en el que se guardaran sus valores. Si no se encontro que lo recibido fue un
    sub prefijo se tomara como un valor del sub prefijo declarado anteriormente.

    Por logica se tiene en cuenta que el primer valor del array de 'comamnd' es el
    nombre del main prefix y lo que le siguen sus valores y subprefijos.

    Al final se llama al callback del prefijo principal y este recibe un objeto que
    alamcena los prefijo y valores procesados junto con metodos que ayudaran a trabajar
    con esos valores, el callbakc tambien recibe el evento del mensaje que lo llamo
    para que pueda hacer cosas como saber quien lo hizo y/o identificar el canal
    y mandar el mensaje de resultado.

*/

async function ResolvePrefix(Prefix, command, event){

    let BuildInput=[];

    //Procesar 'command'.
    for(let i of command.slice(1)){

        //Buscar si se trata de un nuevo prefijo
        if(i == Prefix.getName() || Prefix.getSubPrefixGroup().find(x=>x.getName()==i)){

            //Buscar si el prefijo ya fue llamado
            if(BuildInput.find(x=>{
                return i == x.name; 
            })) return event.channel.send("No se puede repetir el nombre de los prefijos.");

            BuildInput[BuildInput.length] = {
                name:i,
                vals:[]
            }
        } else {
            //Al determinar que no se trata de un prefijo se determina que es un valor y se guarda
            BuildInput[
                BuildInput.length - 1
            ].vals[
                BuildInput[
                    BuildInput.length - 1
                ].vals.length] = i;
        }

    }

    //EJECUTAR FUNCION

    Prefix.execute(new PrefixMethoded(BuildInput), event);

}

export { ResolvePrefix };