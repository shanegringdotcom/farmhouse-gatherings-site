import { useEffect, useRef, useState } from "react";
import { mapsUrl } from "@/data/ice-cream";

// Lake map for the Big Long Lake guide, following the IceCreamMap pattern:
// Leaflet is loaded lazily inside an effect because it touches `window` on
// import (which would throw during the static prerender) and it keeps the map
// chunk out of the main bundle for pages that never show a map.
//
// The launch coordinates come from the Google Maps listing for "Big Long Lake
// Public Access Launch" (9555 E 600 S); the lake bounds from the OpenStreetMap
// water polygon. The Farmhouse itself is deliberately NOT pinned — the site
// only publishes a town-level location for the house (see the VacationRental
// geo in index.html), and this map keeps that choice.
const LAUNCH_COORDS: [number, number] = [41.569, -85.2435];
const LAUNCH_ADDRESS = "9555 E 600 S, Wolcottville, IN 46795";

// Southwest / northeast corners of the lake itself, so the whole shoreline is
// framed regardless of container size.
const LAKE_BOUNDS: [[number, number], [number, number]] = [
  [41.546, -85.2506],
  [41.5695, -85.2181],
];

const BigLongLakeMap = () => {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let cancelled = false;

    (async () => {
      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        if (cancelled || !el.current) return;

        // scrollWheelZoom off so the page still scrolls normally over the map.
        const m = L.map(el.current, { scrollWheelZoom: false });
        map = m;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(m);

        L.marker(LAUNCH_COORDS, {
          icon: L.divIcon({
            className: "",
            html: '<div style="background:#c5613c;color:#fff;min-width:24px;height:24px;border-radius:12px;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);font:600 12px/20px system-ui,sans-serif;text-align:center">&#9875;</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        })
          .addTo(m)
          .bindPopup(
            `<strong>Big Long Lake Public Access Launch</strong><br>` +
              `DNR public ramp on the channel at the north end of the lake.<br>` +
              `<a href="${mapsUrl(`Big Long Lake Public Access Launch, ${LAUNCH_ADDRESS}`)}" target="_blank" rel="noopener noreferrer">${LAUNCH_ADDRESS}</a>`,
            { maxWidth: 280 },
          );

        m.fitBounds(
          L.latLngBounds([...LAKE_BOUNDS, LAUNCH_COORDS]),
          { padding: [30, 30] },
        );
      } catch {
        // Tiles blocked, offline, or the chunk failed — fall back to the note
        // below rather than leaving an empty grey box.
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <div>
      <div
        ref={el}
        role="application"
        aria-label="Map of Big Long Lake, Indiana, with the public access boat launch marked at the north end"
        className="w-full h-[420px] sm:h-[520px] rounded-2xl overflow-hidden border border-border/40 bg-surface-cool z-0"
      />
      <p className="font-body text-xs text-[#2b2520]/40 mt-3">
        {failed
          ? "The map could not load — the public access launch is at 9555 E 600 S, Wolcottville, at the north end of the lake."
          : "The orange pin is the public access launch at the north end of the lake. Open it for the address and directions."}
      </p>
    </div>
  );
};

export default BigLongLakeMap;
