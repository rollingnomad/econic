import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";

export function SiteCommunityBox() {
  const [newSiteName, setNewSiteName] = useState("");
  const [newSiteLocation, setNewSiteLocation] = useState("");

  const sites = useLiveQuery(() => db.sites.toArray(), []);

  const handleSiteName = (e) => {
    const value = e.target.value;
    setNewSiteName(value);
  };

  const handleSiteLocation = (e) => {
    const value = e.target.value;
    setNewSiteLocation(value);
  };

  const addSite = async () => {
    if (!newSiteName.trim() || !newSiteLocation.trim()) return;
    await db.sites.add({
      name: newSiteName,
      location: newSiteLocation,
    });

    setNewSiteName("");
    setNewSiteLocation("");
  };

  const deleteSite = async (id) => {
    await db.sites.delete(id);
  };

  return (
    <div className="p-2 w-full flex flex-col">
      <input
        className="p-2 m-2 border rounded shadow-sm"
        type="text"
        placeholder="Add site name"
        value={newSiteName}
        onChange={handleSiteName}
      />
      <input
        className="p-2 m-2 border rounded shadow-sm"
        type="text"
        placeholder="Add site location"
        value={newSiteLocation}
        onChange={handleSiteLocation}
      />
      <button className="p-2 m-2 border" onClick={addSite}>
        Add site
      </button>
      <ul>
        {sites?.map((site) => (
          <li key={site.id}>
            Site ID: {site.id}
            <div>
              Name: {site.name} - Address: {site.location}
            </div>
            <button
              className="bg-red-500 p-2 border"
              onClick={() => deleteSite(site.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
