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
    const mapElement = document.createElement('div');
    mapElement.style.width = '600px';
    mapElement.style.height = '400px';
    mapElement.id = containerId;
    document.body.appendChild(mapElement);

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

    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = mapElement.querySelector('canvas');
    const dataUrl = canvas?.toDataURL('image/png');

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

      printWindow.document.write(`
        <html>
          <head>
            <title>Relatórios CBIOs</title>
            <style>
              @media print {
                body { 
                  margin: 0;
                  padding: 0;
                }
                .report-page {
                  page-break-after: always;
                  padding: 16px;
                }
                .report-page:last-child {
                  page-break-after: avoid;
                }
                .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 8px;
                }
                .logo {
                  height: 24px;
                  width: auto;
                }
                .status-badge {
                  padding: 4px 12px;
                  border-radius: 9999px;
                  font-size: 12px;
                }
                .status-elegivel {
                  background-color: #dcfce7;
                  color: #166534;
                }
                .status-nao-elegivel {
                  background-color: #fee2e2;
                  color: #991b1b;
                }
                .title {
                  color: #064C9F;
                  font-size: 20px;
                  font-weight: bold;
                  margin: 0;
                }
                .info-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                  margin-bottom: 16px;
                }
                .info-section {
                  font-size: 11px;
                }
                .info-section h2 {
                  color: #064C9F;
                  font-size: 14px;
                  margin-bottom: 4px;
                }
                .info-content {
                  line-height: 1.4;
                }
                .info-row {
                  margin-bottom: 2px;
                }
                .info-label {
                  font-weight: 500;
                }
                .images-section h2 {
                  color: #064C9F;
                  font-size: 14px;
                  margin-bottom: 8px;
                }
                .images-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 8px;
                }
                .image-card {
                  background: #F3F4F6;
                  border-radius: 8px;
                  padding: 8px;
                }
                .map-container {
                  width: 100%;
                  height: 200px;
                  margin-bottom: 8px;
                  border-radius: 4px;
                  overflow: hidden;
                }
                .image-info {
                  font-size: 10px;
                  line-height: 1.4;
                }
              }
            </style>
          </head>
          <body>
      `);

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
            <div class="report-page">
              <div class="header">
                <img src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png" alt="Merx Logo" class="logo" />
                <div class="status-badge ${getStatusClass(report.status)}">
                  ${report.status}
                </div>
              </div>

              <h1 class="title">Relatório CBIOs</h1>

              <div class="info-grid">
                <div class="info-section">
                  <h2>Dados da Propriedade</h2>
                  <div class="info-content">
                    <div class="info-row"><span class="info-label">CAR:</span> ${report.car}</div>
                    <div class="info-row"><span class="info-label">Município:</span> ${report.municipality}</div>
                    <div class="info-row"><span class="info-label">UF:</span> ${report.state}</div>
                    <div class="info-row"><span class="info-label">Status do CAR:</span> ${report.carStatus}</div>
                    <div class="info-row"><span class="info-label">Data de Registro:</span> ${report.registrationDate}</div>
                    <div class="info-row"><span class="info-label">Área Declarada:</span> ${report.declaredArea} ha</div>
                  </div>
                </div>

                <div class="info-section">
                  <h2>Dados da Análise</h2>
                  <div class="info-content">
                    <div class="info-row"><span class="info-label">Área Consolidada:</span> ${report.consolidatedArea} ha</div>
                    <div class="info-row"><span class="info-label">Biomassa:</span> ${report.biomass}</div>
                    <div class="info-row"><span class="info-label">Ano de Análise:</span> ${report.analysisYear}</div>
                    <div class="info-row"><span class="info-label">Produtividade:</span> ${report.productivity} kg/ha</div>
                    <div class="info-row"><span class="info-label">Safra de Referência:</span> ${report.harvestReference}</div>
                    <div class="info-row"><span class="info-label">Potencial Produtivo:</span> ${report.productivePotential} ton</div>
                  </div>
                </div>
              </div>

              <div class="images-section">
                <h2>Imagens e Sensores</h2>
                <div class="images-grid">
                  ${report.images.map((image, index) => `
                    <div class="image-card">
                      <div class="map-container">
                        <img src="${mapImageData}" alt="Mapa ${index + 1}" style="width: 100%; height: 100%; object-fit: cover;" />
                      </div>
                      <div class="image-info">
                        <div><span class="info-label">Sensores:</span> ${image.sensor}</div>
                        <div><span class="info-label">Data:</span> ${image.date}</div>
                        <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                          <span class="info-label">ID:</span> ${image.imageId}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `);
        }
      }

      printWindow.document.write('</body></html>');
      printWindow.document.close();

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
