/**
 * World-map geometry for the Journey section.
 *
 * The atlas ships locally via the `world-atlas` npm package, so there is no
 * runtime CDN fetch. Projection and coordinates match the prototype exactly:
 * geoNaturalEarth1 fit to a sphere inside a 10px inset of the 720x400 viewBox.
 * Everything is computed once at module load and shared.
 *
 * The map is decorative-degradable: if anything here throws, the exports fall
 * back to empty/no-op values and the Journey section still works.
 */
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import type { GeoProjection } from "d3-geo";
import type { Topology, GeometryObject } from "topojson-specification";
import worldData from "world-atlas/countries-110m.json";

export const MAP_W = 720;
export const MAP_H = 400;

let landPath = "";
let gratPath = "";
let projection: GeoProjection | null = null;

try {
  const topology = worldData as unknown as Topology;
  const land = feature(
    topology,
    topology.objects.countries as GeometryObject,
  );
  projection = geoNaturalEarth1().fitExtent(
    [
      [10, 10],
      [MAP_W - 10, MAP_H - 10],
    ],
    { type: "Sphere" },
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
