import Dexie from "dexie";

// Initialize the database
export const db = new Dexie("ecoDb");

// Define the schema
db.version(1).stores({
  speciesData: "speciesId, newCode, commonName, scientificName",
  sites: "++id, name, location",
  communities: "++id, siteId, name",
  observations: "++id, communityId, speciesId",
});

export async function initializeDatabase() {
  const count = await db.speciesData.count();

  if (count === 0) {
    console.log("Seeding database...");
    try {
      // NOTE: In a Vite/React project, files in the 'public' folder
      // are served from the root path '/'
      const response = await fetch("/sofiaData.json");

      if (!response.ok) throw new Error("Could not fetch species data.");

      const data = await response.json();

      // bulkPut handles the array of objects
      await db.speciesData.bulkPut(data);

      console.log("Database seeded successfully!");
    } catch (err) {
      console.error("Seeding failed:", err);
    }
  }
}
