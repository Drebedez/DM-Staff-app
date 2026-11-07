import {Report, ReportForm} from "@dm-staff/report";
import { appClient } from "../ClientDiscordInstance/main.js";
import { db } from "../dataBaseLoader/main.js";
import ScriptConfig from './config.json' with { type:'json' };

ReportForm.addReportOption(...ScriptConfig.reportFormOptions);
Report.setClient(appClient);

Report.addFormReportHandler( async (form)=>{

    const reportId = db.reports.prepare(`
            INSERT INTO reports (user_id, user_name, title, category, message, date)
            VALUES (?,?,?,?,?,?)
            RETURNING id;
        `).get([
            form.user.id,
            form.user.name,
            form.reportForm.title,
            form.reportForm.category,
            form.reportForm.message,
            form.date.toString().replace('T', ' ').split('.')[0]
        ]).id;

    form.reportForm.files?.forEach( async file => {

            const fetchImage = await fetch(file.proxyURL);

            db.reports.prepare(`
                INSERT INTO files (report_id, content, extension)
                VALUES (?,?,?);
            `).run([
                reportId,
                fetchImage.ok? Buffer.from(await fetchImage.arrayBuffer()) : null,
                file.contentType?.split("/")[1]
            ]);

        })
    
})