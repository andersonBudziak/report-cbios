
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { ReportList } from "@/components/ReportList";
import { Report } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockReports: Report[] = [
  {
    id: "1",
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
    coordinates: [-55.815776, -12.5147015],
    images: [/* ... keep existing code */],
  },
  {
    id: "2",
    car: "MT-5103403-7DE5821C70B84D2FB942A46B2DC16B42",
    municipality: "Cuiabá",
    state: "MT",
    carStatus: "Ativo",
    registrationDate: "22/05/2021",
    declaredArea: 245.32,
    status: "ELEGÍVEL",
    consolidatedArea: 180.45,
    biomass: "Soja",
    analysisYear: 2023,
    productivity: 4.123,
    harvestReference: "22/23",
    productivePotential: 743.89,
    coordinates: [-55.715776, -12.4147015],
    images: [/* ... keep existing code */],
  },
  {
    id: "3",
    car: "MT-5103452-8FE5821C70B84D2FB942A46B2DC16B43",
    municipality: "Sinop",
    state: "MT",
    carStatus: "Pendente",
    registrationDate: "30/06/2021",
    declaredArea: 312.65,
    status: "NÃO ELEGÍVEL",
    consolidatedArea: 290.15,
    biomass: "Soja",
    analysisYear: 2023,
    productivity: 3.892,
    harvestReference: "22/23",
    productivePotential: 1129.26,
    coordinates: [-55.915776, -12.6147015],
    images: [/* ... keep existing code */],
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

      // Cria uma nova janela para cada relatório selecionado
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
              body { font-family: Arial, sans-serif; }
              .report { page-break-after: always; }
              .report:last-child { page-break-after: avoid; }
              .header { text-align: center; margin-bottom: 20px; }
              .content { margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
              th { background-color: #f5f5f5; }
            </style>
          </head>
          <body>
      `);

      // Adiciona cada relatório selecionado à janela de impressão
      selectedReports.forEach((reportId) => {
        const report = reports.find(r => r.id === reportId);
        if (report) {
          printWindow.document.write(`
            <div class="report">
              <div class="header">
                <h1>Relatório CBIOs</h1>
                <h2>CAR: ${report.car}</h2>
              </div>
              <div class="content">
                <table>
                  <tr>
                    <th colspan="2">Dados da Propriedade</th>
                  </tr>
                  <tr>
                    <td>Município</td>
                    <td>${report.municipality}</td>
                  </tr>
                  <tr>
                    <td>Estado</td>
                    <td>${report.state}</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>${report.status}</td>
                  </tr>
                  <tr>
                    <td>Área Declarada</td>
                    <td>${report.declaredArea} ha</td>
                  </tr>
                  <tr>
                    <td>Data de Registro</td>
                    <td>${report.registrationDate}</td>
                  </tr>
                </table>

                <table>
                  <tr>
                    <th colspan="2">Dados da Análise</th>
                  </tr>
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
            </div>
          `);
        }
      });

      // Fecha o HTML e imprime
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Espera o conteúdo carregar antes de imprimir
      printWindow.onload = () => {
        printWindow.print();
        // Fecha a janela após a impressão (opcional)
        // printWindow.close();
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
