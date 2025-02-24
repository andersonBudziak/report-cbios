
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { ReportList } from "@/components/ReportList";
import { Report } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OlMap from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';

const mockReports: Report[] = [
  {
    id: "1",
    car: "SP-1234567-123456789",
    municipality: "São Paulo",
    state: "SP",
    carStatus: "ATIVO",
    registrationDate: "2021-01-01",
    declaredArea: 1000,
    status: "ELEGÍVEL",
    consolidatedArea: 800,
    biomass: "Alta",
    analysisYear: 2023,
    productivity: 3500,
    harvestReference: "2022/2023",
    productivePotential: 2800,
    coordinates: [-46.6333, -23.5505],
    images: [
      {
        id: "1",
        sensor: "Sentinel-2",
        imageId: "S2A_MSIL2A_20230615",
        date: "2023-06-15",
        centralCoordinate: [-46.6333, -23.5505],
        url: "https://example.com/image1.jpg"
      }
    ]
  },
  {
    id: "2",
    car: "MG-7654321-987654321",
    municipality: "Belo Horizonte",
    state: "MG",
    carStatus: "PENDENTE",
    registrationDate: "2021-02-15",
    declaredArea: 1500,
    status: "NÃO ELEGÍVEL",
    consolidatedArea: 1200,
    biomass: "Média",
    analysisYear: 2023,
    productivity: 3200,
    harvestReference: "2022/2023",
    productivePotential: 2500,
    coordinates: [-43.9378, -19.9208],
    images: [
      {
        id: "2",
        sensor: "Landsat-8",
        imageId: "LC08_L1TP_20230620",
        date: "2023-06-20",
        centralCoordinate: [-43.9378, -19.9208],
        url: "https://example.com/image2.jpg"
      }
    ]
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [reports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReports, setFilteredReports] = useState(reports);
  const { toast } = useToast();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    const filtered = reports.filter(report => 
      report.car.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const handleSelectReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const generateMapImage = async (coordinates: [number, number], containerId: string) => {
    // Criar um elemento temporário para o mapa
    const mapElement = document.createElement('div');
    mapElement.style.width = '600px';
    mapElement.style.height = '400px';
    mapElement.id = containerId;
    document.body.appendChild(mapElement);

    // Inicializar o mapa
    const map = new OlMap({
      target: containerId,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat(coordinates),
        zoom: 13,
      }),
    });

    // Aguardar o carregamento do mapa
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Capturar o canvas do mapa
    const canvas = mapElement.querySelector('canvas');
    const dataUrl = canvas?.toDataURL('image/png');

    // Limpar
    document.body.removeChild(mapElement);

    return dataUrl;
  };

  const handlePrint = async (selectedReports: string[]) => {
    if (selectedReports.length === 0) {
      toast({
        title: "Nenhum relatório selecionado",
        description: "Por favor, selecione pelo menos um relatório para imprimir.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Preparando impressão",
        description: `Preparando ${selectedReports.length} relatório(s) para impressão...`,
      });

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Não foi possível abrir a janela de impressão');
      }

      // HTML base para a nova janela
      printWindow.document.write(`
        <html>
          <head>
            <title>Relatórios CBIOs</title>
            <link rel="stylesheet" href="/src/index.css">
            <style>
              body { 
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              .report { 
                page-break-after: always;
                max-width: 1200px;
                margin: 0 auto;
              }
              .report:last-child { 
                page-break-after: avoid;
              }
              .header { 
                text-align: center;
                margin-bottom: 20px;
                padding: 20px;
                border-bottom: 2px solid #064C9F;
              }
              .content {
                margin: 20px;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
              }
              .map-section {
                grid-column: span 2;
                margin: 20px 0;
              }
              .map-container {
                width: 100%;
                height: 400px;
                margin-bottom: 20px;
              }
              .map-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
              }
              table { 
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background: white;
              }
              th, td { 
                padding: 12px;
                text-align: left;
                border: 1px solid #e2e8f0;
              }
              th { 
                background-color: #f8fafc;
                font-weight: 600;
                color: #064C9F;
              }
              .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 9999px;
                font-weight: 500;
                font-size: 14px;
              }
              .status-elegivel {
                background-color: #dcfce7;
                color: #166534;
              }
              .status-nao-elegivel {
                background-color: #fee2e2;
                color: #991b1b;
              }
              .status-pendente {
                background-color: #fff7ed;
                color: #9a3412;
              }
              .logo {
                height: 48px;
                width: auto;
              }
              .satellite-images {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
                margin-top: 20px;
              }
              .satellite-image {
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 12px;
              }
              .satellite-info {
                margin-top: 8px;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
      `);

      // Adicionar cada relatório selecionado à janela de impressão
      for (const reportId of selectedReports) {
        const report = reports.find(r => r.id === reportId);
        if (report) {
          const mapImageData = await generateMapImage(report.coordinates, `map-${report.id}`);
          
          const getStatusClass = (status: string) => {
            switch (status) {
              case "ELEGÍVEL":
                return "status-elegivel";
              case "NÃO ELEGÍVEL":
                return "status-nao-elegivel";
              default:
                return "status-pendente";
            }
          };

          printWindow.document.write(`
            <div class="report">
              <div class="header">
                <img src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png" alt="Merx Logo" class="logo" />
                <h1 style="color: #064C9F; margin-top: 16px;">Relatório CBIOs</h1>
                <h2 style="color: #64748b;">CAR: ${report.car}</h2>
                <div class="status-badge ${getStatusClass(report.status)}">
                  ${report.status}
                </div>
              </div>

              <div class="content">
                <div>
                  <h3 style="color: #064C9F; margin-bottom: 16px;">Dados da Propriedade</h3>
                  <table>
                    <tr>
                      <td>Município</td>
                      <td>${report.municipality}</td>
                    </tr>
                    <tr>
                      <td>Estado</td>
                      <td>${report.state}</td>
                    </tr>
                    <tr>
                      <td>Status do CAR</td>
                      <td>${report.carStatus}</td>
                    </tr>
                    <tr>
                      <td>Data de Registro</td>
                      <td>${report.registrationDate}</td>
                    </tr>
                    <tr>
                      <td>Área Declarada</td>
                      <td>${report.declaredArea} ha</td>
                    </tr>
                  </table>
                </div>

                <div>
                  <h3 style="color: #064C9F; margin-bottom: 16px;">Dados da Análise</h3>
                  <table>
                    <tr>
                      <td>Área Consolidada</td>
                      <td>${report.consolidatedArea} ha</td>
                    </tr>
                    <tr>
                      <td>Biomassa</td>
                      <td>${report.biomass}</td>
                    </tr>
                    <tr>
                      <td>Ano de Análise</td>
                      <td>${report.analysisYear}</td>
                    </tr>
                    <tr>
                      <td>Produtividade</td>
                      <td>${report.productivity} kg/ha</td>
                    </tr>
                    <tr>
                      <td>Safra de Referência</td>
                      <td>${report.harvestReference}</td>
                    </tr>
                    <tr>
                      <td>Potencial Produtivo</td>
                      <td>${report.productivePotential} ton</td>
                    </tr>
                  </table>
                </div>

                <div class="map-section">
                  <h3 style="color: #064C9F; margin-bottom: 16px;">Localização</h3>
                  <div class="map-container">
                    <img src="${mapImageData}" alt="Mapa da propriedade" class="map-image" />
                  </div>
                </div>

                <div style="grid-column: span 2;">
                  <h3 style="color: #064C9F; margin-bottom: 16px;">Imagens e Sensores</h3>
                  <div class="satellite-images">
                    ${report.images.map(image => `
                      <div class="satellite-image">
                        <div style="width: 100%; height: 200px; background-color: #f8fafc; border-radius: 4px;"></div>
                        <div class="satellite-info">
                          <p><strong>Sensor:</strong> ${image.sensor}</p>
                          <p><strong>Data:</strong> ${image.date}</p>
                          <p><strong>ID:</strong> ${image.imageId}</p>
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `);
        }
      }

      // Fecha o HTML e imprime
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Espera o conteúdo carregar antes de imprimir
      printWindow.onload = () => {
        printWindow.print();
      };

      console.log("Printing reports:", selectedReports);
    } catch (error) {
      toast({
        title: "Erro na impressão",
        description: "Não foi possível imprimir os relatórios selecionados.",
        variant: "destructive",
      });
      console.error("Erro ao imprimir:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#064C9F]">Relatórios CBIOs</h1>
        <img 
          src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png"
          alt="Merx Logo" 
          className="h-12 w-auto"
        />
      </div>
      
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar por número do CAR..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 bg-[#F3F4F6] border-[#F3F4F6] focus:border-[#2980E8] text-[#1F2937]"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      </div>

      <Map reports={filteredReports} onSelectReport={handleSelectReport} />
      <ReportList reports={filteredReports} onPrint={handlePrint} />
    </div>
  );
};

export default Index;
