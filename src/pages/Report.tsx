
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer } from "lucide-react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { useEffect, useRef } from "react";
import OSM from "ol/source/OSM";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { toast } = useToast();

  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/api/reports/${id}`);
      if (!response.ok) {
        throw new Error('Erro ao carregar detalhes do relatório');
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (!report?.images) return;

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

  if (error) {
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Não foi possível carregar os detalhes do relatório. Tente novamente mais tarde.",
    });
  }

  const handlePrint = () => {
    document.body.classList.add('printing');
    window.print();
    document.body.classList.remove('printing');
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando detalhes do relatório...</div>;
  }

  if (!report) {
    return <div className="text-center py-8">Relatório não encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-[#1F2937]"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
        </div>
        <img 
          src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png"
          alt="Merx Logo" 
          className="h-12 w-auto"
        />
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir</span>
        </Button>
      </div>

      <Card className="p-6 space-y-8">
        <div className="flex justify-between items-center print:mb-8">
          <h1 className="text-3xl font-bold text-[#064C9F]">Relatório CBIOs</h1>
          <img 
            src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png"
            alt="Merx Logo" 
            className="h-12 w-auto hidden print:block"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
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
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#064C9F] mb-4">
              Imagens e Sensores
            </h2>
            <div className="space-y-6">
              {report.images.map((image, index) => (
                <Card key={index} className="p-4 bg-[#F3F4F6]">
                  <h3 className="font-medium mb-2 text-[#064C9F]">
                    Imagem {index + 1}
                  </h3>
                  <div 
                    ref={el => mapRefs.current[index] = el} 
                    className="w-full h-48 mb-4 rounded-lg overflow-hidden"
                  />
                  <div className="space-y-1 text-sm text-[#1F2937]">
                    <p>
                      <span className="font-medium">Sensores:</span>{" "}
                      {image.sensor}
                    </p>
                    <p>
                      <span className="font-medium">ID da Imagem:</span>{" "}
                      {image.imageId}
                    </p>
                    <p>
                      <span className="font-medium">Data:</span> {image.date}
                    </p>
                    <p>
                      <span className="font-medium">Coordenada Central:</span>{" "}
                      {image.centralCoordinate.join(", ")}
                    </p>
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
