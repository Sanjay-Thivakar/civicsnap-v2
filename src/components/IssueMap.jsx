import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";

const DEFAULT_CENTER = [12.9716, 77.5946]; // India fallback

export default function IssueMap({ issues = [] }) {
  const center =
    issues.length > 0
      ? [issues[0].location.lat, issues[0].location.lng]
      : DEFAULT_CENTER;

  return (
    <div className="border rounded p-4 mt-6 bg-white">
      <h3 className="font-semibold mb-2">Issue Locations</h3>
      <p className="text-sm text-gray-500 mb-2">
        Heatmap shows unresolved issue density. Markers show exact locations.
      </p>

      <div className="h-96">
        <MapContainer
          center={center}
          zoom={issues.length > 0 ? 11 : 5}
          className="h-full w-full rounded"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔥 HEATMAP LAYER */}
          <HeatLayer issues={issues} />

          {/* 📍 MARKERS */}
          {issues.map(
            (issue) =>
              issue.location && (
                <Marker
                  key={issue.id}
                  position={[issue.location.lat, issue.location.lng]}
                >
                  <Popup>
                    <strong>{issue.userTitle}</strong>
                    <br />
                    {issue.userDescription}
                  </Popup>
                </Marker>
              )
          )}
        </MapContainer>
      </div>
    </div>
  );
}

/* 🔥 CUSTOM HEAT LAYER */
function HeatLayer({ issues }) {
  const map = useMap();

  useEffect(() => {
    if (!map || issues.length === 0) return;

    const points = issues
      .filter((i) => i.location)
      .map((i) => [
        i.location.lat,
        i.location.lng,
        0.7, // intensity
      ]);

    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 18,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, issues]);

  return null;
}
