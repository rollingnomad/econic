import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../database-info/db";

export function ObservationList({ site, community }) {
  const observations = useLiveQuery(() => {
    if (!community) return [];
    return db.observations
      .where("communityId")
      .equals(Number(community.id))
      .toArray();
  }, [community]);

  if (!site || !community) {
    return <h1>Loading site and community data...</h1>;
  }

  return (
    <div>
      {observations?.length === 0 && <p>No observations added...</p>}
      {observations?.map((obs) => (
        <div key={obs.id} className="p-2 border-b">
          Species ID: {obs.speciesId}
        </div>
      ))}
    </div>
  );
}
