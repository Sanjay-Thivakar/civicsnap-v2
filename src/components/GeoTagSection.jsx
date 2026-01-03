import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [12.9716, 77.5946]; // India fallback

export default function GeoTagSection({ issues = [] }) {
  const hasIssues = Array.isArray(issues) && issues.length > 0;

  const center = hasIssues
    ? [issues[0].location.lat, issues[0].location.lng]
    : DEFAULT_CENTER;

  return (
    <div className="border rounded p-4 mt-6 bg-white">
      <h3 className="font-semibold mb-2">Issue Locations</h3>

      <p className="text-sm text-gray-500 mb-3">
        All unresolved issues are geo-tagged to help authorities identify problem
        areas quickly.
      </p>

      <div className="h-96">
        <MapContainer
          center={center}
          zoom={hasIssues ? 11 : 5}
          className="h-full w-full rounded"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔹 MARKERS ONLY FOR UNRESOLVED ISSUES */}
          {hasIssues &&
            issues.map(
              (issue) =>
                issue.location && (
                  <Marker
                    key={issue.id}
                    position={[
                      issue.location.lat,
                      issue.location.lng,
                    ]}
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
