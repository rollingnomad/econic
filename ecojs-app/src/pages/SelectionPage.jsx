import React, { useState } from "react";
import { db } from "../database-info/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useApp } from "../AppContext";

export function SelectionPage() {
  const { activeSiteId, setSite, setCommunity } = useApp();

  //   Local state for text inputs to assign new sites/communities
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteLocation, setNewSiteLocation] = useState("");
  const [newCommunityName, setNewCommunityName] = useState("");

  // Get all sites
  const sites = useLiveQuery(() => db.sites.toArray());

  // Get all communities for the selected site
  const communities = useLiveQuery(
    () =>
      db.communities
        .where("siteId")
        .equals(activeSiteId || 0)
        .toArray(),
    [activeSiteId],
  );

  //   Handlers for Sites
  const handleCreateSite = async (e) => {
    e.preventDefault();
    if (!newSiteName.trim()) return;

    const id = await db.sites.add({
      name: newSiteName,
      location: newSiteLocation,
    });

    // Update context to have a Site Id
    setSite(id);
    // Reset entry fields
    setNewSiteName("");
    setNewSiteLocation("");
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    if (!newCommunityName.trim()) return;

    const id = await db.communities.add({
      siteId: activeSiteId,
      name: newCommunityName,
    });

    setCommunity(id);
    setNewCommunityName("");
  };
  return (
    <div className="p-2 w-full h-screen flex flex-col bg-green-500">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        ecoSofia
      </h1>

      {/* STEP 1: SITE SELECTION */}
      {!activeSiteId ? (
        <section className="p-8 rounded-2xl shadow-xl border border-white bg-white">
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                Step 1: Choose Existing Site
              </label>
              <select
                className="w-full p-3 text-gray-800 bg-white border border-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                onChange={(e) => setSite(Number(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>
                  Select existing Site...
                </option>
                {sites?.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name} {site.location ? `(${site.location})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <label className="block text-lg font-medium text-gray-800 mb-2 pt-10">
              Create New Site
            </label>

            <form onSubmit={handleCreateSite} className="space-y-3">
              <input
                className="w-full p-3 bg-white border border-gray-800 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="New Site Name"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                required
              />
              <input
                className="w-full p-3 bg-white border border-gray-800 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="New Site Location"
                value={newSiteLocation}
                onChange={(e) => setNewSiteLocation(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-3 hover:bg-green-500 hover:text-white bg-white rounded-lg text-green-500 border border-gray-800  transition-colors duration-200"
              >
                Create & Continue
              </button>
            </form>
          </div>
        </section>
      ) : (
        /* STEP 2: COMMUNITY SELECTION */
        <section className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <button
            onClick={() => setSite(null)}
            className="flex items-center text-green-500 hover:text-green-800 text-sm font-medium mb-6 transition-colors"
          >
            <span className="mr-1">←</span> Back to Sites
          </button>

          <h2 className="block text-lg font-medium text-gray-800 mb-2">
            Step 2: Community
          </h2>
          <div className="bg-white border border-gray-200 p-3 rounded-lg mb-6">
            <p className="text-sm text-green-500">
              Selected Site:{" "}
              <span className="font-bold">
                {sites?.find((s) => s.id === activeSiteId)?.name}
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                Choose Existing Community
              </label>
              <select
                className="w-full p-3 text-gray-800 bg-white border border-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                onChange={(e) => setCommunity(Number(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>
                  Select a Community
                </option>
                {communities?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="block text-lg font-medium text-gray-800 mb-2 pt-10">
              Create New Community
            </label>

            <form onSubmit={handleCreateCommunity} className="space-y-3">
              <input
                className="w-full p-3 bg-white border border-gray-800 rounded-lg text-gray-800 focus:ring-2 focus:ring-green-500 outline-none transition-all"
                placeholder="Community Name (e.g. Forest)"
                value={newCommunityName}
                onChange={(e) => setNewCommunityName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-200"
              >
                Start Observations
              </button>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
