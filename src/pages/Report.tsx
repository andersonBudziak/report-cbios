
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Report = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportHtml, setReportHtml] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetch(`/relatorios_html/${id}.html`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Relatório não encontrado');
        }
        return response.text();
      })
      .then((html) => {
        const cleanedHtml = html.replace(
          /<html[^>]*>|<head[^>]*>|<\/head>|<body[^>]*>|<\/body>|<\/html>/gi,
          ""
        );
        setReportHtml(cleanedHtml);
      })
      .catch((error) => {
        console.error("Erro ao carregar o relatório HTML:", error);
        toast({
          title: "Erro ao carregar relatório",
          description: "Não foi possível carregar o relatório solicitado.",
          variant: "destructive",
        });
      });
  }, [id, toast]);

  const handlePrint = () => {
    try {
      document.body.classList.add('printing');
      
      toast({
        title: "Impressão iniciada",
        description: "Preparando documento para impressão...",
      });

      window.print();

      document.body.classList.remove('printing');
    } catch (error) {
      toast({
        title: "Erro na impressão",
        description: "Não foi possível imprimir o documento.",
        variant: "destructive",
      });
      console.error("Erro ao imprimir:", error);
    }
  };

  if (!reportHtml) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            className="flex items-center space-x-2 text-[#1F2937]"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar</span>
          </Button>
          <img
            src="/lovable-uploads/aecb3a36-0513-4295-bd99-f0db9a41a78b.png"
            alt="Merx Logo"
            className="h-8 w-auto"
          />
        </div>
        <div className="text-center">Carregando relatório...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho fixo */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-[#1F2937] no-print"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar</span>
            </Button>
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
        </div>
      </div>

      {/* Conteúdo do relatório */}
      <div className="container mx-auto px-4 py-8 print:p-0 print:m-0">
        <div className="bg-white shadow-lg rounded-lg p-6 print:shadow-none print:p-0">
          <div
            dangerouslySetInnerHTML={{ __html: reportHtml }}
            className="report-content"
          />
        </div>
      </div>
    </div>
  );
};

export default Report;
