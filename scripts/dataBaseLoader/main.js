import Database from 'better-sqlite3';
import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};
import { textFix } from '../../AppLibs/textRep/main.js';

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

const db = {
    
}

export {db}