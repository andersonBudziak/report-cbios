
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-[#064C9F] mb-4">404</h1>
      <p className="text-gray-600 mb-8">Página não encontrada</p>
      <Button 
        onClick={() => navigate("/")}
        className="bg-[#064C9F] hover:bg-[#043b7d]"
      >
        Voltar para a página inicial
      </Button>
    </div>
  );
};

export default NotFound;
