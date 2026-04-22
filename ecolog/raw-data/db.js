import { Dexie } from "dexie";
import { SOFIA_DATA } from "./sofiaData";

export const db = new Dexie("ecoDb");

db.version(1).stores({
  speciesData: "speciesId, newCode, commonName, scientificName",
  sites: "++id, name, location",
  communities: "++id, siteId, name",
  observations: "++id, communityId, speciesId",
});

export async function initializeDatabase() {
  const count = await db.speciesData.count();

  if (count == 0) {
    console.log("Seeding database...");
    await db.speciesData.bulkPut(SOFIA_DATA);
  }
}
