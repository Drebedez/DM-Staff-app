import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};
import { msgManager } from '../../AppLibs/messageDBManager/main.js';
import {appClient} from '../ClientDiscordInstance/main.js';

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

const db = {
    messages: new msgManager(path.join(dbDir, 'messages.db')).setAppClient(appClient)
}

export {db}