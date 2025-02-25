
import { useState } from "react";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { Printer } from "lucide-react";
import { Report } from "@/types/report";
import { useNavigate } from "react-router-dom";

interface ReportListProps {
  reports: Report[];
  onPrint: (selectedReports: string[]) => void;
}

export const ReportList = ({ reports, onPrint }: ReportListProps) => {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSelect = (reportId: string) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    setSelectedReports(
      selectedReports.length === reports.length
        ? []
        : reports.map((report) => report.id)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={selectedReports.length === reports.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-[#1F2937]">Selecionar Todos</span>
        </div>
        <Button
          onClick={() => onPrint(selectedReports)}
          disabled={selectedReports.length === 0}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir Selecionados</span>
        </Button>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <Card
            key={report.id}
            className="report-card cursor-pointer bg-[#F3F4F6] hover:bg-white p-4"
            onClick={() => navigate(`/report/${report.id}`)}
          >
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={selectedReports.includes(report.id)}
                onCheckedChange={() => handleSelect(report.id)}
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-[#064C9F]">CAR: {report.car}</h3>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.status === "ELEGÍVEL"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-[#DC2626]"
                    }`}
                  >
                    {report.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-[#1F2937]">
                  <div>
                    <p>Município: {report.municipality} - {report.state}</p>
                    <p>Área: {report.declaredArea} ha</p>
                  </div>
                  <div>
                    <p>Cultura: {report.biomass}</p>
                    <p>Ano de Análise: {report.analysisYear}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

