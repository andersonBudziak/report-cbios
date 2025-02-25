
import { Report } from "@/types/report";

export const fetchReports = async (): Promise<Report[]> => {
  try {
    const response = await fetch('/data/reports.json');
    const data = await response.json();
    return data.reports;
  } catch (error) {
    console.error("Erro ao carregar relatórios:", error);
    throw new Error("Não foi possível carregar os relatórios");
  }
};

export const fetchReport = async (id: string): Promise<Report | null> => {
  try {
    const response = await fetch('/data/reports.json');
    const data = await response.json();
    return data.reports.find((report: Report) => report.id === id) || null;
  } catch (error) {
    console.error("Erro ao carregar relatório:", error);
    throw new Error("Não foi possível carregar o relatório");
  }
};
