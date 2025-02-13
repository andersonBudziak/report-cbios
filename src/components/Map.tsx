
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Report } from "@/types/report";

interface MapProps {
  reports: Report[];
  onSelectReport: (reportId: string) => void;
}

const Map = ({ reports, onSelectReport }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = "YOUR_MAPBOX_TOKEN"; // Replace with your token
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [-55.815776, -12.5147015], // Center on the first report
      zoom: 8,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for each report
    reports.forEach((report) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(report.coordinates)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
            <strong>CAR: ${report.car}</strong><br/>
            ${report.municipality} - ${report.state}<br/>
            Área: ${report.declaredArea} ha
          `)
        )
        .addTo(map.current!);

      marker.getElement().addEventListener("click", () => {
        onSelectReport(report.id);
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [reports, onSelectReport]);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
