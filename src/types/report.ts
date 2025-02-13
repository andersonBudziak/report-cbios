
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
  images: SatelliteImage[];
}

export interface SatelliteImage {
  id: string;
  sensor: string;
  imageId: string;
  date: string;
  centralCoordinate: [number, number];
  url: string;
}
