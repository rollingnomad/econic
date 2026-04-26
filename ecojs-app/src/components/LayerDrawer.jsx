import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";

export function LayerDrawer({ editingObsId, setEditingObs }) {
  const obs = useLiveQuery(
    () => db.observations.get(editingObsId),
    [editingObsId],
  );

  if (!obs) return null;

  const layers = [1, 2, 3, 4];
  const values = ["Null", "R", "O", "A", "D"];

  const updateLayer = async (layer, value) => {
    await db.observations.update(editingObsId, {
      layers: {
        ...obs.layers,
        [layer]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-80">
        {/* Title uses live species if available */}
        <h2 className="font-bold mb-1">
          Edit {obs.species?.commonName ?? "Observation"}
        </h2>

        <p className="text-xs text-gray-500 mb-3">
          {obs.species?.scientificName}
        </p>

        {/* Layers */}
        {layers.map((layer) => (
          <div key={layer} className="mb-3">
            <p className="text-sm font-semibold mb-1">
              Layer {layer}:{" "}
              <span className="text-green-600">
                {obs.layers?.[layer] ?? "Null"}
              </span>
            </p>

            <div className="flex gap-2 flex-wrap">
              {values.map((v) => {
                const selected = (obs.layers?.[layer] ?? "Null") === v;

                return (
                  <button
                    key={v}
                    onClick={() => updateLayer(layer, v)}
                    className={`px-2 py-1 border rounded text-sm ${
                      selected
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {v}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Close */}
        <button
          onClick={() => setEditingObs(null)}
          className="mt-3 w-full bg-gray-200 py-1 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
