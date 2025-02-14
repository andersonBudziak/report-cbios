
import { Report } from "@/types/report";

interface PropertyDataProps {
  report: Report;
}

export const PropertyData = ({ report }: PropertyDataProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">
        Dados da Propriedade
      </h2>
      <div className="space-y-2 text-[#1F2937]">
        <p>
          <span className="font-medium">CAR:</span> {report.car}
        </p>
        <p>
          <span className="font-medium">Município:</span>{" "}
          {report.municipality}
        </p>
        <p>
          <span className="font-medium">UF:</span> {report.state}
        </p>
        <p>
          <span className="font-medium">Status do CAR:</span>{" "}
          {report.carStatus}
        </p>
        <p>
          <span className="font-medium">Data de Registro:</span>{" "}
          {report.registrationDate}
        </p>
        <p>
          <span className="font-medium">
            Área Declarada do CAR (ha):
          </span>{" "}
          {report.declaredArea}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              report.status === "ELEGÍVEL"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {report.status}
          </span>
        </p>
      </div>
    </div>
  );
};
