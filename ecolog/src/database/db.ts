import { EcoDatabase, type SofiaSpecies } from "../types";

export const db = new EcoDatabase();

export async function initializeDatabase() {
  const count = await db.speciesData.count();

  if (count == 0) {
    console.log("Seeding database...");

    try {
      const response = await fetch("../../public/sofiaData.json");

      if (!response.ok) throw new Error("Could not fetch species data.");

      const data: SofiaSpecies[] = await response.json();

      await db.speciesData.bulkPut(data);

      console.log("Database seeded succesfully!");
    } catch (err) {
      console.error("Seeding failed:", err);
    }
  }
}
