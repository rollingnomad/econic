export function Header() {
  const onLoad = () => {
    console.log("Load clicked!");
  };
  const onSave = () => {
    console.log("Save clicked!");
  };

  return (
    <header className="bg-green-500 text-white px-4 py-2 shadow min-w-screen">
      <div className="flex items-center justify-between">
        {/* Left: App Name */}
        <h1 className="text-lg font-bold">ecoSofia</h1>

        {/* Right: Actions */}
        <div className="flex gap-2">
          <button
            onClick={onLoad}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition"
          >
            Pick Site
          </button>
          <button
            onClick={onSave}
            className="bg-white text-green-600 hover:bg-gray-300 px-3 py-1 rounded text-sm font-medium transition"
          >
            Save
          </button>
        </div>
      </div>
    </header>
  );
}
