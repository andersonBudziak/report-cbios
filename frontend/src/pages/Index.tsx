
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { ReportList } from "@/components/ReportList";
import { Report } from "@/types/report";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: reports = [], isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/reports');
      if (!response.ok) {
        throw new Error('Erro ao carregar relatórios');
      }
      return response.json();
    },
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Erro",
      description: "Não foi possível carregar os relatórios. Tente novamente mais tarde.",
    });
  }

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

      {isLoading ? (
        <div className="text-center py-8">Carregando relatórios...</div>
      ) : (
        <>
          <Map reports={filteredReports} onSelectReport={handleSelectReport} />
          <ReportList reports={filteredReports} onPrint={handlePrint} />
        </>
      )}
    </div>
  );
};

export default Index;
