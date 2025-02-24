
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { useEffect, useRef } from "react";
import ImageLayer from "ol/layer/Image";
import Static from "ol/source/ImageStatic";
import { getCenter } from "ol/extent";
import OSM from "ol/source/OSM";
import { useToast } from "@/hooks/use-toast";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const report = {
    car: "MT-5108501-70D4821B80A84D2FB942A46B2DC16B41",
    municipality: "Vera",
    state: "MT",
    carStatus: "Ativo",
    registrationDate: "14/04/2021",
    declaredArea: 173.78,
    status: "ELEGÍVEL",
    consolidatedArea: 80.75,
    biomass: "Soja",
    analysisYear: 2023,
    productivity: 3.773,
    harvestReference: "22/23",
    productivePotential: 304.67,
    images: [
      {
        sensor: "S2A",
        imageId: "S2A_MSIL1C_20170904T140051_N0205_R067_T21LXQ_20170904T140051",
        date: "04/09/2017",
        centralCoordinate: [-55.815776, -12.5147015],
      },
      {
        sensor: "S2B",
        imageId: "S2B_MSIL1C_20230730T135709_N0509_R067_T21LXQ_20230730T171930",
        date: "30/07/2023",
        centralCoordinate: [-55.815776, -12.5147015],
      },
      {
        sensor: "S2A",
        imageId: "S2A_MSIL1C_20240619T135711_N0510_R067_T21LXQ_20240619T171933",
        date: "19/06/2024",
        centralCoordinate: [-55.815776, -12.5147015],
      },
    ],
  };

  useEffect(() => {
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
  }, [report.images]);

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

        <div className="grid grid-cols-3 gap-4 print:gap-2">
          <div className="space-y-4 print:space-y-2 col-span-1">
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

          <div className="col-span-2">
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
                    className="w-full h-32 mb-2 rounded-lg overflow-hidden print:h-40"
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
