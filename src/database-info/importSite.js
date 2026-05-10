import { db } from "./db";

export async function importSite(data) {
  // Basic validation
  if (
    !data ||
    !data.site ||
    !Array.isArray(data.communities) ||
    !Array.isArray(data.observations) ||
    !Array.isArray(data.species)
  ) {
    throw new Error("Invalid import file.");
  }

  await db.transaction(
    "rw",
    db.sites,
    db.communities,
    db.observations,
    db.speciesData,
    async () => {
      // Site
      await db.sites.put(data.site);

      // Communities
      await db.communities.bulkPut(data.communities);

      // Species
      await db.speciesData.bulkPut(data.species);

      // Observations
      await db.observations.bulkPut(data.observations);
    },
  );

  return data.site;
}
