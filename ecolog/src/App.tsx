import { initializeDatabase } from "./database/db.ts";
import { useEffect, useState } from "react";

function App() {
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
    <>
      <h1 className="text-5xl font-bold">EcoApp</h1>
    </>
  );
}

export default App;
