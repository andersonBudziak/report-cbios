
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { ReportList } from "@/components/ReportList";
import { Report } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data
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
    images: [],
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
    images: [],
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
    images: [],
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [reports] = useState<Report[]>(mockReports);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  const filteredReports = reports.filter(report => 
    report.car.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handlePrint = (selectedReports: string[]) => {
    console.log("Printing reports:", selectedReports);
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
