import fs from 'node:fs';
import Database from 'better-sqlite3';
import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};

const db = {}

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

fs.readdirSync(dbDir).forEach(x=>{
    if(path.extname(x) == '.db'){
        db[path.parse(x).name] = new Database(`${dbDir}/${x}`);
    }
});

export {db}