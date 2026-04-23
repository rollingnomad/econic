import { useEffect, useState } from "react";
import { initializeDatabase } from "./database-info/db";
import { HomePage } from "./pages/HomePage";
import { Header } from "./pages/Header";

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
    <div className="min-h-screen bg-gray-100 flex flex-col justify-start align-top">
      <Header />
      <HomePage />
    </div>
  );
}
