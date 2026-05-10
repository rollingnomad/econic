import { SearchBar } from "../components/SearchBar";
import { SiteCommunityBox } from "../components/SiteCommunityBox";

export function HomePage() {
  return (
    <div className="w-full">
      <SiteCommunityBox />
      <SearchBar />
    </div>
  );
}
