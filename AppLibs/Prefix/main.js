import ScriptConfig from './config.json' with {type:'json'};
import { PrefixManager } from './scripts/PrefixManager.js';

//Exportar manejador de prefijos
const Prefix = new PrefixManager(ScriptConfig.mainPrefix);

//Exportamos creando el objeto que maneja prefijos que seran llamados con el nombre de la configuracion.
export { Prefix };