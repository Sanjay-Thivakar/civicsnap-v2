import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

export default function IssueHeatMap({ issues }) {
  useEffect(() => {}, [issues]);

  if (!issues || issues.length === 0) {
    return (
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-2">Issue Density Heatmap</h3>
        <div className="h-72 flex items-center justify-center text-gray-400 border border-dashed">
          No unresolved issues to visualize
        </div>
      </div>
    );
  }

  const points = issues
    .filter((i) => i.location)
    .map((i) => [i.location.lat, i.location.lng, 0.6]);

  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-2">Issue Density Heatmap</h3>

      <MapContainer
        center={[points[0][0], points[0][1]]}
        zoom={11}
        className="h-96 w-full rounded"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer points={points} />
      </MapContainer>
    </div>
  );
}

/* 🔥 HEAT LAYER WRAPPER */
function HeatLayer({ points }) {
  const map = window._leaflet_map_instance;

  useEffect(() => {
    if (!map) return;

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 18,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}
