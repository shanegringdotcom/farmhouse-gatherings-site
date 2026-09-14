// Loaded lazily by MotionProvider so the drag/spring feature bundle becomes
// its own client-side chunk (same reasoning as the lazy Leaflet import in the
// map components) — the prerender and main bundle only carry the tiny `m`
// component shims.
export { domMax as default } from "motion/react";
