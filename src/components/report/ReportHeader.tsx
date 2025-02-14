
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

interface ReportHeaderProps {
  onBack: () => void;
  onPrint: () => void;
}

export const ReportHeader = ({ onBack, onPrint }: ReportHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8 print:hidden">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="flex items-center space-x-2 text-[#1F2937]"
          onClick={onBack}
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
        onClick={onPrint}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Printer className="h-4 w-4" />
        <span>Imprimir</span>
      </Button>
    </div>
  );
};
