import {Report, ReportForm} from "@dm-staff/report";
import { appClient } from "../ClientDiscordInstance/main.js";

ReportForm.addReportOption();
Report.setClient(appClient);
