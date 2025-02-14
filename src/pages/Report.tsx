
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { PropertyData } from "@/components/report/PropertyData";
import { AnalysisData } from "@/components/report/AnalysisData";
import { SatelliteImages } from "@/components/report/SatelliteImages";
import { ReportHeader } from "@/components/report/ReportHeader";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
      <ReportHeader onBack={() => navigate("/")} onPrint={handlePrint} />

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
            <PropertyData report={report} />
            <AnalysisData report={report} />
          </div>
          <div>
            <SatelliteImages images={report.images} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Report;
