/**
 * World-map geometry for the Journey section.
 *
 * The atlas ships locally via the `world-atlas` npm package, so there is no
 * runtime CDN fetch. The projection is geoNaturalEarth1, but instead of fitting
 * the whole sphere it fits to the four journey cities so the map is zoomed in
 * and the dots are large. The land extends past the viewBox and is simply
 * clipped, which is fine. Everything is computed once at module load.
 *
 * The map is decorative-degradable: if anything here throws, the exports fall
 * back to empty/no-op values and the Journey section still works.
 */
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import type { GeoProjection } from "d3-geo";
import type { Topology, GeometryObject } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";
import { cities } from "@/content/site";

export const MAP_W = 800;
export const MAP_H = 520;

// Inset padding around the cities. Small padding zooms the map in as far as
// possible; labels anchor inward (see labelAnchor in the city data) so they no
// longer need wide margins to avoid clipping. The cities stay vertically
// centered, so top/bottom labels remain clear of the cropped poles.
const PAD_X = 44;
const PAD_Y = 80;

let landPath = "";
let gratPath = "";
let projection: GeoProjection | null = null;

try {
  const topology = worldData as unknown as Topology;
  const land = feature(
    topology,
    topology.objects.countries as GeometryObject,
  );
  // Fit to the cities (zoom in) rather than the whole sphere.
  const cityBounds = {
    type: "MultiPoint" as const,
    coordinates: cities.map((c) => [c.lng, c.lat]),
  };
  projection = geoNaturalEarth1().fitExtent(
    [
      [PAD_X, PAD_Y],
      [MAP_W - PAD_X, MAP_H - PAD_Y],
    ],
    cityBounds,
  );
  const path = geoPath(projection);
  landPath = path(land) ?? "";
  gratPath = path(geoGraticule10()) ?? "";
} catch {
  landPath = "";
  gratPath = "";
  projection = null;
}

export const mapReady = Boolean(landPath);
export { landPath, gratPath };

/** Project [lng, lat] to viewBox coordinates, rounded to one decimal. */
export function project(lng: number, lat: number): { x: number; y: number } {
  if (!projection) return { x: 0, y: 0 };
  const p = projection([lng, lat]);
  if (!p) return { x: 0, y: 0 };
  return { x: +p[0].toFixed(1), y: +p[1].toFixed(1) };
}
