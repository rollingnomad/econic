export function CalculationsBox({ community }) {
  console.log("community:", community);
  if (!community) return null;
  return (
    <div className="p-2">
      <div className="p-2 my-2 border rounded-lg border-gray-500 flex justify-between items-center">
        <p>{community?.siteId}</p>
      </div>
    </div>
  );
}
