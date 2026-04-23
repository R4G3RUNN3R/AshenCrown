import { getCityDistricts } from "./cityDistricts";
import { worldCities, worldRegions, worldRoutes, type WorldCityId } from "./worldMapData";

export type MapNodeVisibility = "visible" | "hidden" | "locked";
export type MapNodeKind =
  | "city"
  | "district"
  | "service"
  | "academy"
  | "guild_site"
  | "consortium_site"
  | "strategic_site"
  | "hidden_site";

export type MapNode = {
  id: string;
  kind: MapNodeKind;
  label: string;
  summary: string;
  route?: string;
  icon?: string;
  visibility: MapNodeVisibility;
  parentId?: string;
  metadata?: Record<string, unknown>;
};

export type MapViewDefinition = {
  id: string;
  label: string;
  kind: "world" | "city";
  anchorCityId?: WorldCityId;
  summary: string;
  nodes: MapNode[];
  edges: Array<{ from: string; to: string; label?: string }>;
};

function buildCityMap(cityId: WorldCityId): MapViewDefinition {
  const city = worldCities.find((entry) => entry.id === cityId) ?? worldCities[0];
  const districts = getCityDistricts(city);
  const districtNodes: MapNode[] = districts.map((district) => ({
    id: `${city.id}:${district.id}`,
    kind: "district",
    label: district.name,
    summary: district.summary,
    visibility: "visible",
    parentId: city.id,
    metadata: {
      image: district.image ?? null,
    },
  }));

  const serviceNodes: MapNode[] = districts.flatMap((district) =>
    district.destinations.map((destination) => ({
      id: `${city.id}:${district.id}:${destination.id}`,
      kind:
        destination.id.includes("guild")
          ? "guild_site"
          : destination.id.includes("consortium")
            ? "consortium_site"
            : destination.id.includes("academy")
              ? "academy"
              : "service",
      label: destination.name,
      summary: destination.description,
      route: destination.route,
      icon: destination.icon,
      visibility: destination.locked ? "locked" : "visible",
      parentId: `${city.id}:${district.id}`,
      metadata: {
        lockReason: destination.lockReason ?? null,
      },
    })),
  );

  const hiddenNodes: MapNode[] = [
    {
      id: `${city.id}:hidden:watch`,
      kind: "hidden_site",
      label: "Unmarked Site",
      summary: "Reserved for future ruins, sealed archives, or witness sites.",
      visibility: "hidden",
      parentId: city.id,
      metadata: {
        ownerGuildId: null,
        influence: 0,
        siteType: "future_hidden_node",
      },
    },
  ];

  return {
    id: city.id === "nexis" ? "nexis-city" : `${city.id}-academy-city`,
    label: city.name,
    kind: "city",
    anchorCityId: city.id,
    summary: city.summary,
    nodes: [
      {
        id: city.id,
        kind: "city",
        label: city.name,
        summary: city.summary,
        visibility: "visible",
        metadata: {
          academy: city.academy ?? null,
          region: city.region,
        },
      },
      ...districtNodes,
      ...serviceNodes,
      ...hiddenNodes,
    ],
    edges: [
      ...districtNodes.map((node) => ({ from: city.id, to: node.id })),
      ...serviceNodes.map((node) => ({ from: String(node.parentId), to: node.id })),
    ],
  };
}

export const mapViews: MapViewDefinition[] = [
  {
    id: "world",
    label: "World Map",
    kind: "world",
    summary: "Macro geography, strategic distance, city anchors, and future strategic sites.",
    nodes: [
      ...worldCities.map((city) => ({
        id: city.id,
        kind: "city" as const,
        label: city.name,
        summary: city.summary,
        visibility: "visible" as const,
        metadata: {
          subtitle: city.subtitle,
          academy: city.academy ?? null,
          region: city.region,
          xPercent: city.xPercent,
          yPercent: city.yPercent,
        },
      })),
      ...worldRegions.map((region) => ({
        id: region.id,
        kind: "strategic_site" as const,
        label: region.name,
        summary: region.summary,
        visibility: "visible" as const,
        metadata: {
          regionKind: region.kind,
        },
      })),
      {
        id: "world:hidden:keep-network",
        kind: "hidden_site",
        label: "Unrevealed Stronghold Network",
        summary: "Reserved for keeps, strongholds, and concealed claim sites.",
        visibility: "hidden",
        metadata: {
          ownerGuildId: null,
          influence: 0,
          siteType: "future_stronghold",
        },
      },
    ],
    edges: worldRoutes.map((route) => ({
      from: route.from,
      to: route.to,
      label: route.travelLabel,
    })),
  },
  buildCityMap("nexis"),
  buildCityMap("north"),
  buildCityMap("west"),
  buildCityMap("east"),
  buildCityMap("south"),
];

export function getMapView(mapId: string) {
  return mapViews.find((view) => view.id === mapId) ?? null;
}

export function getCityMap(cityId: WorldCityId) {
  return mapViews.find((view) => view.anchorCityId === cityId) ?? null;
}
