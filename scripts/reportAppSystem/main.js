import {Report, ReportForm} from "../../libTest/Report/index.js";
import { appClient } from "../ClientDiscordInstance/main.js";
import ScriptConfig from './config.json' with { type:'json' };

ReportForm.addReportOption(...ScriptConfig.reportFormOptions);
Report.setClient(appClient);

Report.addFormReportHandler( async (form)=>{
    console.log(form.reportForm.category);
})