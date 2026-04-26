import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";
import Fuse from "fuse.js";
import { useState, useMemo } from "react";

export function SearchBar({ community }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const defaultLayers = {
    1: "N",
    2: "N",
    3: "N",
    4: "N",
  };

  const allSpecies = useLiveQuery(() => db.speciesData.toArray(), []);
  const fuse = useMemo(() => {
    if (!allSpecies) return null;

    return new Fuse(allSpecies, {
      keys: [
        { name: "commonName", weight: 0.7 },
        { name: "scientificName", weight: 0.3 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [allSpecies]);

  const results = useMemo(() => {
    if (!fuse || query.length <= 1 || !community) return [];
    return fuse
      .search(query)
      .slice(0, 20)
      .map((r) => r.item);
  }, [fuse, query, community]);

  const selectSpecies = async (species) => {
    if (!community) return;

    await db.observations.add({
      communityId: Number(community.id),
      speciesId: species.speciesId,
      layers: { ...defaultLayers },
    });

    setQuery("");
    setIsFocused(false);
  };

  return (
    <div className="p-2 w-full flex flex-col">
      <input
        className="p-2 border rounded border-gray-500"
        type="text"
        placeholder="Search species..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)}
      />

      {isFocused && (
        <div className="mt-2 bg-white shadow-lg rounded-lg overflow-y-auto max-h-80">
          {results.length > 0 ? (
            results.map((species) => (
              <div
                key={species.speciesId}
                onClick={() => selectSpecies(species)}
                className="p-3 border-b hover:bg-gray-50 cursor-pointer"
              >
                <p className="font-bold text-green-500">{species.commonName}</p>
                <p className="text-sm italic text-gray-600">
                  {species.scientificName}
                </p>
              </div>
            ))
          ) : query.trim() !== "" ? (
            <p className="p-3 text-gray-500">No results found.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
