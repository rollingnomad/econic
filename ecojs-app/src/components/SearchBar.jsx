import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";
import Fuse from "fuse.js";
import { useState, useMemo } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const allSpecies = useLiveQuery(() => db.speciesData.toArray(), []);

  const fuse = useMemo(() => {
    if (!allSpecies) return null;

    return new Fuse(allSpecies, {
      keys: ["commonName", "scientificName"],
      threshold: 0.3,
    });
  }, [allSpecies]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (fuse && value.length > 1) {
      const searchResults = fuse.search(value);
      setResults(searchResults.map((r) => r.item));
    } else {
      setResults([]);
    }
  };

  const selectSpecies = (species) => {
    console.log("Selected species", species);
  };

  return (
    <div className="p-4">
      <input
        className="w-full p-2 border rounded shadow-sm"
        type="text"
        placeholder="Search species..."
        value={query}
        onChange={handleSearch}
      />

      <div className="mt-2 bg-white shadow-lg rounded-lg overflow-y-auto max-h-80">
        {results.map((species) => (
          <div
            key={species.speciesId}
            onClick={() => selectSpecies(species)}
            className="p-3 border-b hover:bg-gray-50 cursor-pointer"
          >
            <p className="font-bold text-green-800">{species.commonName}</p>
            <p className="text-sm italic text-gray-600">
              {species.scientificName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
