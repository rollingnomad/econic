import { useLiveQuery } from "dexie-react-hooks";
import { Header } from "./Header";
import { SearchBar } from "../components/SearchBar";
import { useParams } from "react-router";
import { db } from "../database-info/db";
import { ObservationList } from "../components/ObservationList";
import { CalculationsBox } from "../components/CalculationsBox";

export function SurveyPage() {
  const { siteId, communityId } = useParams();

  const site = useLiveQuery(() => {
    if (!siteId) return null;
    return db.sites.get(siteId);
  }, [siteId]);

  const community = useLiveQuery(() => {
    if (!communityId) return null;
    return db.communities.get(communityId);
  }, [communityId]);

  const observations = useLiveQuery(async () => {
    if (!communityId) return [];

    const obs = await db.observations
      .where("communityId")
      .equals(communityId)
      .toArray();

    const speciesIds = obs.map((o) => o.speciesId);

    const species = await db.speciesData
      .where("speciesId")
      .anyOf(speciesIds)
      .toArray();

    const map = new Map(species.map((s) => [s.speciesId, s]));

    return obs.map((o) => ({
      ...o,
      species: map.get(o.speciesId),
    }));
  }, [communityId]);

  return (
    <>
      <Header site={site} community={community} />
      <SearchBar community={community} />
      <ObservationList observations={observations} />
      <CalculationsBox community={community} observations={observations} />
    </>
  );
}
