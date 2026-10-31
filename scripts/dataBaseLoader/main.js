import Database from 'better-sqlite3';
import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};
import { textFix } from '../../AppLibs/textRep/main.js';

import { messageDBManager } from '../../AppLibs/messageDBManager/main.js';

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

const db = {
    messages: new messageDBManager(path.join(dbDir, 'messages.db'))
}

export {db}