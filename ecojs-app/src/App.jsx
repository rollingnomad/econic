import { useEffect, useState } from "react";
import { useApp } from "./AppContext";
import { initializeDatabase } from "./database-info/db";
import { HomePage } from "./pages/HomePage";
import { SelectionPage } from "./pages/SelectionPage";
import { Header } from "./pages/Header";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { activeSiteId, activeCommunityId } = useApp();

  useEffect(() => {
    async function setup() {
      await initializeDatabase();
      setIsReady(true);
    }
    setup();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="animate-pulse text-gray-500">Loading species data...</p>
      </div>
    );
  }

  if (!activeSiteId || !activeCommunityId) {
    return <SelectionPage />;
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <Header />
      <HomePage />
    </div>
  );
}
