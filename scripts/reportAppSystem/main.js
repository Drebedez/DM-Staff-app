import {Report, ReportForm} from "../../libTest/Report/index.js";
import { appClient } from "../ClientDiscordInstance/main.js";

ReportForm.addReportOption({
    label:"Prueba",
    value:"sds"
});
Report.setClient(appClient);

Report.addFormReportHandler( async (form)=>{
    console.log(form.reportForm.category);
})