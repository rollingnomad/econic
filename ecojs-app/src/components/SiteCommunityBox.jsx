import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { useApp } from "../AppContext";
import { db } from "../database-info/db";

export function SiteCommunityBox() {
  const { activeSiteId, activeCommunityId, setSite, setCommunity } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newCommunityName, setNewCommunityName] = useState("");

  const communities = useLiveQuery(() => {
    if (!activeSiteId) return [];
    return db.communities.where("siteId").equals(activeSiteId).toArray();
  }, [activeSiteId]);

  const activeSite = useLiveQuery(
    () => (activeSiteId ? db.sites.get(activeSiteId) : null),
    [activeSiteId],
  );

  const activeCommunity = communities?.find((c) => c.id === activeCommunityId);

  const handleSiteChange = () => {
    setSite(null);
    setCommunity(null);
    setIsAdding(false);
  };

  const handleSelectChange = (value) => {
    if (value === "__add_new__") {
      setIsAdding(true);
      return;
    }
    setIsAdding(false);
    if (value === "") {
      setCommunity(null);
    } else {
      setCommunity(Number(value));
    }
  };

  const handleAddCommunity = async () => {
    if (!newCommunityName.trim() || !activeSiteId) return;

    try {
      const id = await db.communities.add({
        name: newCommunityName.trim(),
        siteId: activeSiteId,
      });

      setNewCommunityName("");
      setIsAdding(false);
      setCommunity(id);
    } catch (err) {
      console.error("Failed to add community:", err);
    }
  };

  return (
    <div className="flex flex-col m-2 p-3 border rounded border-gray-500 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 truncate">
          Site: {activeSite ? activeSite.name : "Select a Site..."}
        </span>
        <button
          onClick={handleSiteChange}
          className="text-sm text-white bg-green-500 py-1 px-2 rounded hover:bg-green-600"
        >
          Change
        </button>
      </div>

      <select
        className="w-full p-2 border border-gray-300 rounded-md"
        value={isAdding ? "__add_new__" : (activeCommunityId ?? "")}
        onChange={(e) => handleSelectChange(e.target.value)}
      >
        <option value="" disabled>
          {communities?.length ? "Select a community" : "No communities found"}
        </option>

        {communities?.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}

        <option value="__add_new__">+ Add community</option>
      </select>

      {isAdding && (
        <div className="mt-2 flex gap-2">
          <input
            autoFocus
            className="flex-1 p-2 border border-gray-300 rounded-md"
            placeholder="New community name"
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCommunity()}
          />
          <button
            onClick={handleAddCommunity}
            className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
          >
            Add
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="text-gray-500 text-xs"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
