import { useLocation, useNavigate } from "react-router";
import { exportSite } from "../database-info/exportSite";
import { importSite } from "../database-info/importSite";

export function Header({ site, community }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isSelectionPage = location.pathname === "/";

  const handleChangesite = () => {
    navigate("/");
  };

  const onSave = async () => {
    if (!site?.id) return;

    try {
      const data = await exportSite(site.id);

      const json = JSON.stringify(data, null, 2);

      const file = new File([json], `${site.name}.json`, {
        type: "application/json",
      });

      // Native mobile sharing
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            title: site.name,
            text: `ecoSofia survey export for ${site.name}`,
            files: [file],
          });

          return;
        } catch (shareErr) {
          console.warn(`Share failed, using download fallback - ${shareErr}`);
        }
      }

      // Download fallback
      const blob = new Blob([json], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `${site.name}.json`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Could not export site.");
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const text = await file.text();

      const data = JSON.parse(text);

      const site = await importSite(data);

      alert(`Imported ${site.name}`);
    } catch (err) {
      console.error(err);

      alert("Could not import file.");
    }

    // reset input so same file can be re-imported later
    e.target.value = "";
  };

  return (
    <header className="bg-green-500 text-white px-4 py-2 shadow min-w-screen">
      <div className="flex items-center justify-between">
        {/* Left: App Name */}
        <h1 className="text-lg font-bold">ecoSofia</h1>

        {/* Middle: Site/Community */}

        <div className="flex flex-col text-xs">
          <p>{site?.name}</p>
          <p>{community?.name}</p>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          {/* Swap */}
          <button
            onClick={handleChangesite}
            disabled={isSelectionPage}
            className={`px-3 py-1 rounded text-sm font-medium transition
      ${
        isSelectionPage
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-white text-green-600 hover:bg-gray-300 cursor-pointer"
      }`}
          >
            Swap
          </button>

          {/* Load always enabled */}
          <label className="bg-white text-green-600 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium transition cursor-pointer">
            Load
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>

          {/* Save */}
          <button
            onClick={onSave}
            disabled={isSelectionPage}
            className={`px-3 py-1 rounded text-sm font-medium transition
      ${
        isSelectionPage
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-white text-green-600 hover:bg-gray-300 cursor-pointer"
      }`}
          >
            Save
          </button>
        </div>
      </div>
    </header>
  );
}
