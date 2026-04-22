import { Dexie, type Table } from "dexie";

export interface Species {
  speciesId: number;
  newCode: string;
  commonName: string;
  scientificName: string;
}

export interface Site {
  id?: number;
  name: string;
  location: string;
}

export interface Community {
  id?: number;
  siteId: number;
  name: string;
}

export interface Observation {
  id?: number;
  communityId: number;
  speciesId: number;
}

export class EcoDatabase extends Dexie {
  speciesData!: Table<Species>;
  sites!: Table<Site>;
  communities!: Table<Community>;
  observations!: Table<Observation>;

  constructor() {
    super("ecoDb");
    this.version(1).stores({
      speciesData: "speciesId, newCode, commonName, scientificName",
      sites: "++id, name, location",
      communities: "++id, siteId, name",
      observations: "++id, communityId, speciesId",
    });
  }
}

export interface SofiaSpecies {
  speciesId: number;
  newCode: string;
  scientificName: string;
  commonName: string;
  isPresent: string | null;
  [key: string]: string | number | boolean | null | undefined;
}
