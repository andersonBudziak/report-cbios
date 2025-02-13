
import React, { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Style, Circle, Fill, Stroke } from "ol/style";
import Overlay from "ol/Overlay";
import "ol/ol.css";
import { Report } from "@/types/report";

interface MapProps {
  reports: Report[];
  onSelectReport: (reportId: string) => void;
}

const MapComponent = ({ reports, onSelectReport }: MapProps) => {
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapElement.current) return;

    // Create vector source and features for reports
    const features = reports.map((report) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(report.coordinates)),
        report: report,
      });
      return feature;
    });

    const vectorSource = new VectorSource({
      features: features,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({ color: "#4CAF50" }),
          stroke: new Stroke({ color: "#fff", width: 2 }),
        }),
      }),
    });

    // Initialize map
    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([-55.815776, -12.5147015]),
        zoom: 8,
      }),
    });

    // Create popup overlay
    const popup = new Overlay({
      element: popupRef.current!,
      positioning: "bottom-center",
      offset: [0, -10],
      autoPan: true,
    });
    map.addOverlay(popup);

    // Add click handler
    map.on("click", (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature) {
        const report = (feature as any).get("report") as Report;
        onSelectReport(report.id);
      }
    });

    // Add hover interaction
    map.on("pointermove", (event) => {
      if (event.dragging) return;

      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      const element = popup.getElement()!;

      if (feature) {
        const report = (feature as any).get("report") as Report;
        const coordinates = (feature.getGeometry() as Point).getCoordinates();
        
        element.innerHTML = `
          <div class="bg-white p-2 rounded shadow-lg">
            <strong>CAR: ${report.car}</strong><br/>
            ${report.municipality} - ${report.state}<br/>
            Área: ${report.declaredArea} ha
          </div>
        `;
        popup.setPosition(coordinates);
      } else {
        popup.setPosition(undefined);
      }
    });

    mapRef.current = map;

    return () => {
      map.setTarget(undefined);
    };
  }, [reports, onSelectReport]);

  return (
    <>
      <div ref={mapElement} className="map-container" />
      <div ref={popupRef} className="ol-popup" />
    </>
  );
};

export default MapComponent;
