import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";
import { useState } from "react";
import { LayerDrawer } from "./LayerDrawer";

export function ObservationList({ community }) {
  const [editingObs, setEditingObs] = useState(null);
  const observations = useLiveQuery(async () => {
    if (!community) return [];

    // 1. get observations for this community
    const obs = await db.observations
      .where("communityId")
      .equals(Number(community.id))
      .toArray();

    // 2. get all matching species in ONE query
    const speciesIds = obs.map((o) => o.speciesId);

    const species = await db.speciesData
      .where("speciesId")
      .anyOf(speciesIds)
      .toArray();

    // 3. build lookup map
    const speciesMap = new Map(species.map((s) => [s.speciesId, s]));

    // 4. merge
    return obs.map((o) => ({
      ...o,
      species: speciesMap.get(o.speciesId),
    }));
  }, [community]);

  const handleDeleteObservation = async (id) => {
    const ok = window.confirm("Delete this observation?");
    if (!ok) return;
    await db.observations.delete(id);
  };

  return (
    <div className="p-2">
      {observations?.length === 0 && <p>No observations added...</p>}

      {observations?.map((obs) => (
        <div
          key={obs.id}
          className="p-2 my-2 border rounded-lg border-gray-500 flex justify-between items-center"
        >
          <div>
            <p className="font-bold text-gray-700">
              {obs.species?.commonName ?? "Unknown species"}
            </p>
            <p className="text-xs italic text-gray-500">
              {obs.species?.scientificName ?? "Unknown species"}
            </p>
          </div>

          <div className="space-x-1">
            <button
              onClick={() => setEditingObs(obs)}
              className="px-2 rounded text-white bg-green-500"
            >
              Edit
            </button>

            <button
              onClick={() => handleDeleteObservation(obs.id)}
              className="px-2 rounded text-white bg-red-400"
            >
              X
            </button>
          </div>
        </div>
      ))}

      {editingObs && (
        <LayerDrawer
          editingObsId={editingObs.id}
          setEditingObs={setEditingObs}
        />
      )}
    </div>
  );
}
