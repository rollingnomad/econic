import React, { useEffect, useState } from "react";
import { initializeDatabase } from "./db.js";

export function HomePage() {
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
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">
          Loading species data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold">EcoApp</h1>
      <p className="mt-4 text-green-600">Database is ready and seeded.</p>
    </div>
  );
}
