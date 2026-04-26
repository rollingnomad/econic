import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { initializeDatabase } from "./database-info/db";
import { HomePage } from "./pages/HomePage";
import { SelectionPage } from "./pages/SelectionPage";
import { Header } from "./pages/Header";
import { SurveyPage } from "./pages/SurveyPage";

export default function App() {
  const [isReady, setIsReady] = useState(false);

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

  return (
    <Routes>
      <Route index element={<SelectionPage />} />
      <Route
        path="sites/:siteId/communities/:communityId"
        element={<SurveyPage />}
      />
    </Routes>
  );
}
