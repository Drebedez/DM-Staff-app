/**
 * @todo Libreria en desarrollo al paso de las necesidades de el programa.
 */

class textFix {

    static #key = "$";

    /**
     * 
     * @param {string} txt 
     * @param {any[]} values
     * @returns {string}
     */
    static replaceID(txt, values){
        if(typeof txt != 'string')
            throw Error("No se recibio un texto.");
        if(!Array.isArray(values))
            throw Error("No se recibio un array.");


    }

    /**
     * Remplazar todos los caracteres de la cadena de texto que coincidan con el caracter.
     * @param {string} txt 
     * @param {any[]} values 
     * @returns {string}
     */
    static replaceKey(txt, values){
        if(typeof txt != 'string')
            throw Error("No se recibio un texto.");
        if(!Array.isArray(values))
            throw Error("No se recibio un array.");
        if(!values.length)
            throw Error("No hay valores para reemplazar texto.");

        let index = 0;
        const textSet = [...txt].map(x=>{
            if( x == this.#key ){
                return values[index < values.length? index++ : index];
            }
            return x;
        }).join("");
        return textSet;
    }

    /**
     * Establecer un identificador diferente para partes de el texto cual reemplazar.
     * @param {string} key
     */
    static setKey(key){
        if(typeof key != 'string')
            throw Error('No se recibio un string.');

        this.#key = key;
    }

}

export {textFix}