import fs from 'node:fs';
import Database from 'better-sqlite3';
import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};

const db = {}

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

fs.readdirSync(dbDir).forEach(x=>{
    console.log(x);
    db[path.extname(x)] = new Database(`${dbDir}/${x}`)
})

export {db}