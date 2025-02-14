
import { Report } from "@/types/report";

interface AnalysisDataProps {
  report: Report;
}

export const AnalysisData = ({ report }: AnalysisDataProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">
        Dados da Análise
      </h2>
      <div className="space-y-2 text-[#1F2937]">
        <p>
          <span className="font-medium">Área Consolidada (ha):</span>{" "}
          {report.consolidatedArea}
        </p>
        <p>
          <span className="font-medium">Biomassa:</span>{" "}
          {report.biomass}
        </p>
        <p>
          <span className="font-medium">
            Ano de Referência da Análise:
          </span>{" "}
          {report.analysisYear}
        </p>
        <p>
          <span className="font-medium">
            Produtividade CONAB (kg/ha):
          </span>{" "}
          {report.productivity}
        </p>
        <p>
          <span className="font-medium">
            Safra de Referência (CONAB):
          </span>{" "}
          {report.harvestReference}
        </p>
        <p>
          <span className="font-medium">
            Potencial Produtivo (ton):
          </span>{" "}
          {report.productivePotential}
        </p>
      </div>
    </div>
  );
};
