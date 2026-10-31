import fs from 'node:fs';
import Database from 'better-sqlite3';
import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};
import { textFix } from '../../AppLibs/textRep/main.js';

const db = {}

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

fs.readdirSync(dbDir).forEach(x=>{
    if(path.extname(x) == '.db'){
        const dbName = path.parse(x).name;
        db[dbName] = new Database(`${dbDir}/${x}`);

        (async () => console.log(
            textFix.replaceKey(ScriptConfig.LoadDBlog, [
                dbName
            ]
        )))();

    }
});

export {db}