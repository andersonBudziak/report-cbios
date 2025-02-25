
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { loadReportData } from "@/services/reportService";
import { useQuery } from "@tanstack/react-query";
import MapComponent from "@/components/Map";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => loadReportData(id || ''),
    enabled: !!id
  });

  const handlePrint = () => {
    try {
      document.body.classList.add('printing');
      
      toast({
        title: "Impressão iniciada",
        description: "Preparando documento para impressão...",
      });

      window.print();

      document.body.classList.remove('printing');

      console.log("Printing report:", id);
    } catch (error) {
      toast({
        title: "Erro na impressão",
        description: "Não foi possível imprimir o documento.",
        variant: "destructive",
      });
      console.error("Erro ao imprimir:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ELEGÍVEL":
        return "bg-green-100 text-green-800";
      case "NÃO ELEGÍVEL":
        return "bg-red-100 text-red-800";
      case "Pendente":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Carregando relatório...</h1>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Erro ao carregar relatório</h1>
        <Button variant="ghost" onClick={() => navigate("/")}>
          Voltar para a lista
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 print:p-0 print:m-0">
      <div className="flex justify-between items-center mb-8 print:mb-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-[#1F2937] no-print"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
        </div>
        <img 
          src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png"
          alt="Merx Logo" 
          className="h-8 w-auto print:h-6"
        />
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center space-x-2 no-print"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir</span>
        </Button>
      </div>

      <Card className="p-6 space-y-4 print:shadow-none print:border-none print:p-2">
        <div className="flex justify-between items-center print:mb-2">
          <h1 className="text-2xl font-bold text-[#064C9F] print:text-xl">Relatório CBIOs</h1>
          <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(report.status)} print:text-xs`}>
            {report.status}
          </div>
        </div>

        <div className="space-y-4 print:space-y-2">
          <div className="grid grid-cols-2 gap-4 print:gap-2">
            <div className="print:text-[11px]">
              <h2 className="text-lg font-semibold text-[#064C9F] mb-2 print:text-sm print:mb-1">
                Dados da Propriedade
              </h2>
              <div className="space-y-0.5 text-sm text-[#1F2937] print:text-[11px]">
                <p><span className="font-medium">CAR:</span> {report.car}</p>
                <p><span className="font-medium">Município:</span> {report.municipality}</p>
                <p><span className="font-medium">UF:</span> {report.state}</p>
                <p><span className="font-medium">Status do CAR:</span> {report.carStatus}</p>
                <p><span className="font-medium">Data de Registro:</span> {report.registrationDate}</p>
                <p><span className="font-medium">Área Declarada:</span> {report.declaredArea} ha</p>
              </div>
            </div>

            <div className="print:text-[11px]">
              <h2 className="text-lg font-semibold text-[#064C9F] mb-2 print:text-sm print:mb-1">
                Dados da Análise
              </h2>
              <div className="space-y-0.5 text-sm text-[#1F2937] print:text-[11px]">
                <p><span className="font-medium">Área Consolidada:</span> {report.consolidatedArea} ha</p>
                <p><span className="font-medium">Biomassa:</span> {report.biomass}</p>
                <p><span className="font-medium">Ano de Análise:</span> {report.analysisYear}</p>
                <p><span className="font-medium">Produtividade:</span> {report.productivity} kg/ha</p>
                <p><span className="font-medium">Safra de Referência:</span> {report.harvestReference}</p>
                <p><span className="font-medium">Potencial Produtivo:</span> {report.productivePotential} ton</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#064C9F] mb-2 print:text-sm print:mb-1">
              Imagens e Sensores
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {report.images.map((_, index) => (
                <Card key={index} className="p-2 bg-[#F3F4F6] print:break-inside-avoid">
                  <h3 className="font-medium mb-1 text-[#064C9F] text-sm print:text-[11px]">
                    Imagem {index + 1}
                  </h3>
                  <div className="relative w-full h-48 mb-2 rounded-lg overflow-hidden print:h-52">
                    <MapComponent
                      reports={[report]}
                      onSelectReport={() => {}}
                    />
                  </div>
                  <div className="space-y-0.5 text-xs text-[#1F2937] print:text-[10px]">
                    <p><span className="font-medium">Sensores:</span> {report.images[index].sensor}</p>
                    <p><span className="font-medium">Data:</span> {report.images[index].date}</p>
                    <p className="truncate"><span className="font-medium">ID:</span> {report.images[index].imageId}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Report;
