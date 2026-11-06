import path from 'node:path';
import ScriptConfig from './config.json' with {type:'json'};
import { appClient } from '../ClientDiscordInstance/main.js';
import { MessageDataBaseManager } from '@dm-staff/message-data-base-manager';
import Database from "better-sqlite3";

const dbDir = path.join(import.meta.filename, ScriptConfig.dbSQLdir);

const db = {
    messages: new MessageDataBaseManager(path.join(dbDir, 'messages.db')).setAppClient(appClient),
    reports: new Database(path.join(dbDir, 'reports.db'))
}

export {db}