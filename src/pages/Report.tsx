import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import ImageLayer from "ol/layer/Image";
import { fromLonLat } from "ol/proj";
import { useEffect, useRef, useState } from "react";
import OSM from "ol/source/OSM";
import { useToast } from "@/hooks/use-toast";
import { Report as ReportType } from "@/types/report";
import { loadReportData } from "@/services/reportService";
import { useQuery } from "@tanstack/react-query";

const mockReports = {
  "1": {
    car: "SP-1234567-123456789",
    municipality: "São Paulo",
    state: "SP",
    carStatus: "ATIVO",
    registrationDate: "01/01/2021",
    declaredArea: 1000,
    status: "ELEGÍVEL",
    consolidatedArea: 800,
    biomass: "Soja",
    analysisYear: 2023,
    productivity: 3500,
    harvestReference: "2022/2023",
    productivePotential: 2800,
    images: [
      {
        sensor: "Sentinel-2",
        imageId: "S2A_MSIL2A_20230615",
        date: "15/06/2023",
        centralCoordinate: [-46.6333, -23.5505],
      },
      {
        sensor: "Sentinel-2",
        imageId: "S2A_MSIL2A_20230715",
        date: "15/07/2023",
        centralCoordinate: [-46.6333, -23.5505],
      },
      {
        sensor: "Sentinel-2",
        imageId: "S2A_MSIL2A_20230815",
        date: "15/08/2023",
        centralCoordinate: [-46.6333, -23.5505],
      }
    ],
  },
  "2": {
    car: "MG-7654321-987654321",
    municipality: "Belo Horizonte",
    state: "MG",
    carStatus: "PENDENTE",
    registrationDate: "15/02/2021",
    declaredArea: 1500,
    status: "NÃO ELEGÍVEL",
    consolidatedArea: 1200,
    biomass: "Soja",
    analysisYear: 2023,
    productivity: 3200,
    harvestReference: "2022/2023",
    productivePotential: 2500,
    images: [
      {
        sensor: "Landsat-8",
        imageId: "LC08_L1TP_20230620",
        date: "20/06/2023",
        centralCoordinate: [-43.9378, -19.9208],
      },
      {
        sensor: "Landsat-8",
        imageId: "LC08_L1TP_20230720",
        date: "20/07/2023",
        centralCoordinate: [-43.9378, -19.9208],
      },
      {
        sensor: "Landsat-8",
        imageId: "LC08_L1TP_20230820",
        date: "20/08/2023",
        centralCoordinate: [-43.9378, -19.9208],
      }
    ],
  }
};

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => loadReportData(id || ''),
    enabled: !!id
  });

  useEffect(() => {
    if (!report) return;

    report.images.forEach((image, index) => {
      if (!mapRefs.current[index]) return;

      const map = new Map({
        target: mapRefs.current[index]!,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(image.centralCoordinate),
          zoom: 13,
        }),
      });

      return () => {
        map.setTarget(undefined);
      };
    });
  }, [report?.images]);

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
              {report.images.map((image, index) => (
                <Card key={index} className="p-2 bg-[#F3F4F6] print:break-inside-avoid">
                  <h3 className="font-medium mb-1 text-[#064C9F] text-sm print:text-[11px]">
                    Imagem {index + 1}
                  </h3>
                  <div 
                    ref={el => mapRefs.current[index] = el} 
                    className="w-full h-48 mb-2 rounded-lg overflow-hidden print:h-52"
                  />
                  <div className="space-y-0.5 text-xs text-[#1F2937] print:text-[10px]">
                    <p><span className="font-medium">Sensores:</span> {image.sensor}</p>
                    <p><span className="font-medium">Data:</span> {image.date}</p>
                    <p className="truncate"><span className="font-medium">ID:</span> {image.imageId}</p>
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
