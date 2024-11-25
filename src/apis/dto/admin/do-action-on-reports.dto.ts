import { Report } from "./get-all-reports.dto.ts";

export type DoActionOnReportsDto = {
  action: "ban" | "warn" | "timeout" | "reject";
  reportId: string;
};

export type DoActionOnReportsResponseDto = {
  message: string;
  report: Report;
};
