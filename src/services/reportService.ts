
import { Report, SatelliteImage } from "@/types/report";
import * as geotiff from 'geotiff';

export const loadReportData = async (carFolder: string): Promise<Report> => {
  try {
    // Carregar o JSON com os dados do relatório
    const response = await fetch(`/data/${carFolder}/data.json`);
    const reportData = await response.json();

    // Carregar as imagens TIF
    const images: SatelliteImage[] = await Promise.all(
      Array.from({ length: 3 }, async (_, index) => {
        const imageNumber = index + 1;
        try {
          // Carregar arquivo TIF
          const tiffResponse = await fetch(`/data/${carFolder}/imagem${imageNumber}.tif`);
          const tiffArrayBuffer = await tiffResponse.arrayBuffer();
          const tiff = await geotiff.fromArrayBuffer(tiffArrayBuffer);
          const image = await tiff.getImage();
          const rasterData = await image.readRasters();

          // Aqui você pode processar os dados raster do TIF
          // Por enquanto, vamos apenas registrar que conseguimos carregar o arquivo
          console.log(`TIF ${imageNumber} carregado com sucesso:`, {
            width: image.getWidth(),
            height: image.getHeight(),
          });

          return {
            id: `${reportData.car}-image-${imageNumber}`,
            sensor: reportData.images[index]?.sensor || "Não especificado",
            imageId: reportData.images[index]?.imageId || `IMG_${imageNumber}`,
            date: reportData.images[index]?.date || "Data não disponível",
            centralCoordinate: reportData.images[index]?.centralCoordinate || [0, 0],
            url: `/data/${carFolder}/imagem${imageNumber}.tif`
          };
        } catch (error) {
          console.error(`Erro ao carregar imagem ${imageNumber}:`, error);
          // Se houver erro ao carregar o TIF, vamos usar as URLs das imagens fornecidas como fallback
          const fallbackImages = [
            "/lovable-uploads/2191ed4c-a1b6-46f1-9289-68a45cdb48bc.png",
            "/lovable-uploads/a00a789b-96d2-4a38-af5b-b39585a8141c.png",
            "/lovable-uploads/5fef2137-e98f-43fd-ae6d-55d1cf28fc3b.png"
          ];
          
          return {
            id: `${reportData.car}-image-${imageNumber}`,
            ...reportData.images[index],
            url: fallbackImages[index]
          };
        }
      })
    ).then(images => images.filter((img): img is SatelliteImage => img !== null));

    return {
      ...reportData,
      id: reportData.car, // Usando o CAR como ID do relatório
      images
    };
  } catch (error) {
    console.error("Erro ao carregar dados do relatório:", error);
    throw new Error("Não foi possível carregar os dados do relatório");
  }
};

export const loadAllReports = async (): Promise<Report[]> => {
  try {
    // Aqui você precisará de um endpoint ou arquivo que liste todas as pastas CAR disponíveis
    const response = await fetch('/data/cars.json');
    const carFolders = await response.json();

    const reports = await Promise.all(
      carFolders.map((carFolder: string) => loadReportData(carFolder))
    );

    return reports;
  } catch (error) {
    console.error("Erro ao carregar lista de relatórios:", error);
    throw new Error("Não foi possível carregar a lista de relatórios");
  }
};
