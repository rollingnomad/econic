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
    return db.sites.get(Number(siteId));
  }, [siteId]);

  const community = useLiveQuery(() => {
    if (!communityId) return null;
    return db.communities.get(Number(communityId));
  }, [communityId]);

  return (
    <>
      <Header site={site} community={community} />
      <SearchBar community={community} />
      <ObservationList site={site} community={community} />
      <CalculationsBox community={community} />
    </>
  );
}
