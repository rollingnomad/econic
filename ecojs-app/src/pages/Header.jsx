import { useNavigate } from "react-router";

export function Header({ site, community }) {
  const navigate = useNavigate();
  const handleChangesite = () => {
    navigate("/");
  };
  const onSave = () => {
    console.log("Save clicked!");
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
          <button
            onClick={handleChangesite}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition"
          >
            Pick Site
          </button>
          <button
            onClick={onSave}
            className="bg-white text-green-600 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium transition"
          >
            Save & Send
          </button>
        </div>
      </div>
    </header>
  );
}
