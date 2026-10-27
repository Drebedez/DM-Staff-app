import './scripts/ScriptInitiator/main.js';

import { appClient } from './scripts/ClientDiscordInstance/main.js';
import APP_DATA from './data/json/APP_ID_DATA.json' with {type:'json'};

appClient.login(APP_DATA.TOKEN);