
import { Card } from "@/components/ui/card";
import { SatelliteImage } from "@/types/report";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { useEffect, useRef } from "react";
import OSM from "ol/source/OSM";

interface SatelliteImagesProps {
  images: SatelliteImage[];
}

export const SatelliteImages = ({ images }: SatelliteImagesProps) => {
  const mapRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    images.forEach((image, index) => {
      if (!mapRefs.current[index]) return;

      const map = new Map({
        target: mapRefs.current[index]!,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat(image.centralCoordinate),
          zoom: 13,
        }),
      });

      return () => {
        map.setTarget(undefined);
      };
    });
  }, [images]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-[#064C9F] mb-4">
        Imagens e Sensores
      </h2>
      <div className="space-y-6">
        {images.map((image, index) => (
          <Card key={index} className="p-4 bg-[#F3F4F6]">
            <h3 className="font-medium mb-2 text-[#064C9F]">
              Imagem {index + 1}
            </h3>
            <div 
              ref={el => mapRefs.current[index] = el} 
              className="w-full h-48 mb-4 rounded-lg overflow-hidden"
            />
            <div className="space-y-1 text-sm text-[#1F2937]">
              <p>
                <span className="font-medium">Sensores:</span>{" "}
                {image.sensor}
              </p>
              <p>
                <span className="font-medium">ID da Imagem:</span>{" "}
                {image.imageId}
              </p>
              <p>
                <span className="font-medium">Data:</span> {image.date}
              </p>
              <p>
                <span className="font-medium">Coordenada Central:</span>{" "}
                {image.centralCoordinate.join(", ")}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
