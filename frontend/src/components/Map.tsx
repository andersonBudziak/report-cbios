
import React from 'react';
import { Report } from "@/types/report";

interface MapProps {
  reports: Report[];
  onSelectReport: (reportId: string) => void;
}

const Map = ({ reports, onSelectReport }: MapProps) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-4 h-[400px] flex items-center justify-center">
      <p className="text-gray-500">Mapa será implementado em breve</p>
    </div>
  );
};

export default Map;
