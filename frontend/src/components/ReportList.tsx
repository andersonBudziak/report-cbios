
import React from 'react';
import { Report } from "@/types/report";

interface ReportListProps {
  reports: Report[];
  onPrint: (selectedReports: string[]) => void;
}

export const ReportList = ({ reports, onPrint }: ReportListProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Relatórios</h2>
      <div className="space-y-2">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{report.car}</h3>
                <p className="text-sm text-gray-600">
                  {report.municipality} - {report.state}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  report.status === "ELEGÍVEL"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {report.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
