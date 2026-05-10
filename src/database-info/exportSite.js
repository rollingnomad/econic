import { db } from "./db";

export async function exportSite(siteId) {
  // Site

  const site = await db.sites.get(siteId);

  if (!site) {
    throw new Error("Site not found...");
  }

  // Communities

  const communities = await db.communities
    .where("siteId")
    .equals(siteId)
    .toArray();

  const communityIds = communities.map((c) => c.id);

  // Observations
  const observations = communityIds.length
    ? await db.observations.where("communityId").anyOf(communityIds).toArray()
    : [];

  // Species used in observations

  const speciesIds = [...new Set(observations.map((o) => o.speciesId))];

  const species = speciesIds.length
    ? await db.speciesData.where("speciesId").anyOf(speciesIds).toArray()
    : [];

  return {
    version: 1,
    exportedAt: new Date().toISOString(),

    site,
    communities,
    observations,
    species,
  };
}
