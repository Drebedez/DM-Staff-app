/**
 * Esta libreria no es de uso general y no esta desarrollada para ser implementada en
 * diferentes estructuras de proyectos.
 */

import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

class translation {

    #defaultLang;

    #langs = {};

    constructor(langDirFile, defaultLang = 'en'){

        this.#defaultLang = defaultLang;

        if(fs.readdirSync(langDirFile))
            fs.readdirSync(langDirFile).forEach(file=>{
                if(path.extname(file)){
                    const translation = fs.readFileSync(path.join(langDirFile, file));
                    this.#langs[path.parse(file).name] = JSON.parse(translation);
                }
            })

    }

    /**
     * Obtener localizacion de texto solicitado.
     * @param {string} id 
     * @param {string} lang
     * @returns {string} 
     * @throws Tira error si no se encuentra ninguna localizacion de lo buscado bajo es solicitado y el default.
     */
    get(id, lang = this.#defaultLang){

        let textRequest;

        if(this.#langs[lang])
            textRequest = this.#langs[lang][id];

        textRequest ??= this.#langs[this.#defaultLang][id];

        if(!textRequest)
            throw Error('No se pudo encontrar una localizacion de texto adecuada.');

        return  textRequest;
    }
}

export {translation};