import fs from 'node:fs';
import path from 'node:path';
import ScriptConfig from './config.json' with {type: 'json'};
import { TextFix } from '@dm-staff/textfix';

const log = (type, ...data) => {
    const date = Temporal.Now.plainDateISO().toString();

    const filePath = path.join(
        import.meta.dirname,
        ScriptConfig.mainFile,
        ScriptConfig.logType[type].name,
        `${ScriptConfig.logType[type].name}_${date}.log`
    );

    if (!fs.existsSync(filePath))
        fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.appendFileSync(
        filePath,
        TextFix.replaceKey(
            ScriptConfig.logType[type].message,
            [
                Temporal.Now.plainTimeISO().toString().replace('T', ' ').split('.')[0],
                ...data,
            ]
        )
    )
}

process.addListener('uncaughtException', (error) => {
    log('crash', error.message, error.stack);
    process.exit(1);
});