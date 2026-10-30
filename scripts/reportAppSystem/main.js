import { Report, reportForm } from "../../AppLibs/Report/main.js";
import { appClient } from "../ClientDiscordInstance/main.js";

reportForm.addReportOption();
Report.setClient(appClient);
