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
import { cityGeo } from "@/content/site";

export const MAP_W = 800;
export const MAP_H = 520;

// Inset padding around the cities. The cities' bounding box is very wide
// (San Francisco → Bangkok) and short, so the horizontal extent constrains the
// scale: wider PAD_X zooms the whole map out and keeps the two horizontal
// extremes (SF and Bangkok) clear of the edges. The vertical padding is
// asymmetric — a small top pad and large bottom pad pull the cities up so the
// land fills the top of the card instead of leaving whitespace there.
const PAD_X = 120;
const PAD_TOP = 55;
const PAD_BOTTOM = 175;

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
    coordinates: cityGeo.map((c) => [c.lng, c.lat]),
  };
  projection = geoNaturalEarth1().fitExtent(
    [
      [PAD_X, PAD_TOP],
      [MAP_W - PAD_X, MAP_H - PAD_BOTTOM],
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
