import { useState } from "react";
import { useNavigate } from "react-router";
import { db } from "../database-info/db";
import { useLiveQuery } from "dexie-react-hooks";
import { Header } from "./Header";
import { deleteSite, deleteCommunity } from "../database-info/deleteItems";

export function SelectionPage() {
  const navigate = useNavigate();
  const [selectedSiteId, setSelectedSiteId] = useState();

  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteLocation, setNewSiteLocation] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");

  // Get all sites
  const sites = useLiveQuery(() => db.sites.toArray());

  // Get all communities for the selected site
  const communities = useLiveQuery(() => {
    if (!selectedSiteId) return [];
    return db.communities.where("siteId").equals(selectedSiteId).toArray();
  }, [selectedSiteId]);

  //   Handlers for Sites
  const handleCreateSite = async (e) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const id = crypto.randomUUID();

    await db.sites.add({
      id,
      name: newSiteName,
      location: newSiteLocation,
    });

    // Update context to have a Site Id
    setSelectedSiteId(id);

    // Reset entry fields
    setNewSiteName("");
    setNewSiteLocation("");
  };

  const selectedSite = useLiveQuery(() => {
    if (!selectedSiteId) return null;
    return db.sites.get(selectedSiteId);
  }, [selectedSiteId]);

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunityName.trim() || !selectedSiteId) return;

    const id = crypto.randomUUID();

    await db.communities.add({
      id,
      siteId: selectedSiteId,
      name: newCommunityName,
    });

    navigate(`/sites/${selectedSiteId}/communities/${id}`);
  };

  const handleCommunitySelect = (id) => {
    navigate(`/sites/${selectedSiteId}/communities/${id}`);
  };

  return (
    <div>
      <Header site={selectedSite} community={null} />
      <div className="p-2 w-full max-w-200 h-screen flex flex-col bg-green-500">
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-white">Sites</h1>
          {/* Sites */}
          <div className="max-h-55 overflow-scroll overflow-x-clip">
            {sites?.map((site) => (
              <div className="flex gap-2" key={site.id}>
                <button
                  onClick={() => setSelectedSiteId(site.id)}
                  className="block w-full rounded bg-white p-2 shadow"
                >
                  {site.name}
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();

                    if (!confirm(`Delete site "${site.name}"?`)) return;

                    await deleteSite(site.id);

                    if (selectedSiteId === site.id) {
                      setSelectedSiteId(null);
                    }
                  }}
                  className="bg-red-500 text-white px-3 rounded"
                >
                  DEL
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newSiteName}
              onChange={(e) => setNewSiteName(e.target.value)}
              placeholder="New site name"
              className="p-2 flex-1 rounded bg-white focus:outline-none"
            />
            <button
              onClick={handleCreateSite}
              className="bg-blue-500 text-white px-4"
            >
              Add
            </button>
          </div>
          {/* Communities */}
          {selectedSiteId && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white">
                Communities in {selectedSite ? selectedSite.name : " "}
              </h2>
              <div className="space-y-2 max-h-65 overflow-scroll">
                {communities?.map((c) => (
                  <div className="flex gap-2" key={c.id}>
                    <button
                      onClick={() => handleCommunitySelect(c.id)}
                      className="block w-full rounded bg-white p-2 shadow"
                    >
                      {c.name}
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (!confirm(`Delete community "${c.name}"?`)) return;

                        await deleteCommunity(c.id);

                        if (selectedSiteId) {
                          // force refresh (Dexie handles it but UI stays consistent)
                          setSelectedSiteId((prev) => prev);
                        }
                      }}
                      className="bg-red-500 text-white px-3 rounded"
                    >
                      DEL
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={newCommunityName}
                  onChange={(e) => setNewCommunityName(e.target.value)}
                  placeholder="New community name"
                  className="p-2 flex-1 rounded bg-white focus:outline-none"
                />
                <button
                  onClick={handleCreateCommunity}
                  className="bg-blue-500 text-white px-4"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
