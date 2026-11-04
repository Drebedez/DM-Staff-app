import { Prefix } from '@dm-staff/prefix';
import ScriptConfig from './config.json' with {type:'json'};

const appPrefix = new Prefix(ScriptConfig.PrefixKey);

export {Prefix};