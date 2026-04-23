import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";
import Fuse from "fuse.js";
import { useState, useMemo } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="p-2 w-full flex flex-col">
      <input
        className="p-2 border rounded shadow-sm"
        type="text"
        placeholder="Search species..."
        value={query}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
      />

      <div className="mt-2 bg-white shadow-lg rounded-lg overflow-y-auto max-h-80">
        {isFocused &&
          (results.length > 0 ? (
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
          ) : null)}
      </div>
    </div>
  );
}
