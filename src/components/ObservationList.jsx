import { db } from "../database-info/db";
import { useState } from "react";
import { LayerDrawer } from "./LayerDrawer";

export function ObservationList({ observations }) {
  const [editingObs, setEditingObs] = useState(null);

  const handleDeleteObservation = async (id) => {
    const ok = window.confirm("Delete this observation?");
    if (!ok) return;
    await db.observations.delete(id);
  };

  return (
    <div className="w-full p-2">
      {observations?.length === 0 && (
        <p className="text-white">No observations added...</p>
      )}

      {observations?.map((obs) => (
        <div
          key={obs.id}
          className="p-2 my-2 border rounded-lg border-gray-500 flex justify-between items-center bg-white"
        >
          {/* Left: Names */}
          <div>
            <p className="font-bold text-gray-700">
              {obs.species?.commonName ?? "Unknown species"}
            </p>
            <p className="text-xs italic text-gray-500">
              {obs.species?.scientificName ?? "Unknown species"}
            </p>
          </div>

          {/* Right: Buttons and layers */}
          <div className="space-x-1 flex items-center">
            <div>
              <div className="flex flex-col text-xs items-center text-gray-500">
                <p>L1-L4</p>
                <div className="flex ">
                  {obs.layers &&
                    Object.entries(obs.layers).map(([layer, value]) => (
                      <p key={layer}>{value}|</p>
                    ))}
                </div>
              </div>
            </div>
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
