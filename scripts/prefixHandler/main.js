import { PrefixManager } from "../../AppLibs/Prefix/main.js";
import ScriptConfig from './config.json' with {type:'json'};

const Prefix = new PrefixManager(ScriptConfig.PrefixKey);

export {Prefix};