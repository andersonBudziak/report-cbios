
export interface Report {
  id: string;
  car: string;
  municipality: string;
  state: string;
  carStatus: string;
  registrationDate: string;
  declaredArea: number;
  status: string;
  consolidatedArea: number;
  biomass: string;
  analysisYear: number;
  productivity: number;
  harvestReference: string;
  productivePotential: number;
  coordinates: [number, number];
  images: string[];
}
