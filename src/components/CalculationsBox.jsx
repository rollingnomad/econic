export function CalculationsBox({ observations, community }) {
  if (!community || !observations) return null;

  const species = observations.map((o) => o.species).filter(Boolean);

  const n = species.length;
  if (!n) return null;

  // split native vs all
  const nativeSpecies = species.filter((s) => s.isInvasive == null);

  const calcMean = (arr, key) => {
    if (!arr.length) return 0;
    return arr.reduce((sum, s) => sum + (s[key] ?? 0), 0) / arr.length;
  };

  // ALL species
  const meanCC = calcMean(species, "coefficientOfConservatism");
  const meanCW = calcMean(species, "coefficientOfWetness");

  const FQI = meanCC * Math.sqrt(n);

  // NATIVE species
  const nNative = nativeSpecies.length;

  const meanCCNative = calcMean(nativeSpecies, "coefficientOfConservatism");
  const meanCWNative = calcMean(nativeSpecies, "coefficientOfWetness");

  const FQINative = nNative > 0 ? meanCCNative * Math.sqrt(nNative) : 0;

  return (
    <div className="m-2 bg-white border p-2 border-gray-500 text-gray-500 rounded-lg space-y-1 flex justify-between items-center text-sm">
      <div className="flex flex-col items-center">
        <p className="font-bold">All Species</p>
        <p>Species: {n}</p>
        <p>Mean CC: {meanCC.toFixed(2)}</p>
        <p>Mean CW: {meanCW.toFixed(2)}</p>
        <p className="font-bold">FQI: {FQI.toFixed(2)}</p>
      </div>

      <hr className="my-2" />
      <div className="flex flex-col items-center">
        <p className="font-bold">Native Species Only</p>
        <p>Native Species: {nNative}</p>
        <p>Mean CC: {meanCCNative.toFixed(2)}</p>
        <p>Mean CW: {meanCWNative.toFixed(2)}</p>
        <p className="font-bold">FQI: {FQINative.toFixed(2)}</p>
      </div>
    </div>
  );
}
