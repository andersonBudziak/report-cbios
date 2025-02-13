
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Map from "@/components/Map";
import { ReportList } from "@/components/ReportList";
import { Report } from "@/types/report";

// Mock data - replace with actual data
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
    images: [
      {
        id: "1",
        sensor: "S2A",
        imageId: "S2A_MSIL1C_20170904T140051_N0205_R067_T21LXQ_20170904T140051",
        date: "04/09/2017",
        centralCoordinate: [-55.815776, -12.5147015],
        url: "",
      },
      // Add other images...
    ],
  },
  // Add more mock reports...
];

const Index = () => {
  const navigate = useNavigate();
  const [reports] = useState<Report[]>(mockReports);

  const handleSelectReport = (reportId: string) => {
    navigate(`/report/${reportId}`);
  };

  const handlePrint = (selectedReports: string[]) => {
    // Implement print functionality
    console.log("Printing reports:", selectedReports);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Relatórios CBIOs</h1>
      <Map reports={reports} onSelectReport={handleSelectReport} />
      <ReportList reports={reports} onPrint={handlePrint} />
    </div>
  );
};

export default Index;
