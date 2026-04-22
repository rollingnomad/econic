import fs from "node:fs";
import Papa from "papaparse";

// Read the CSV file
const csvFile = fs.readFileSync("./sofia.csv", "utf8");

const SOFIA_HEADER_MAP = {
  speciesElementId: "speciesElementId",
  newCode: "newCode",
  isPresent: "isPresent",
  "Scientific Name": "scientificName",
  "Common Name": "commonName",
  CC: "coefficientOfConservatism",
  CW: "coefficientOfWetness",
  GRank: "gRank",
  COSEWIC: "cosewicCOSEWIC",
  NRANK: "nRANK",
  SARO: "saro",
  S_RANK: "sRank",
  CZ: "carolinianZone",
  CZRESTR: "carolinianRestricted",
  ES: "inEssex",
  CK: "inChathamKent",
  LB: "inLambton",
  MD: "inMiddlesex",
  EL: "inElgin",
  OX: "inOxford",
  HN: "inHaldimandNorfolk",
  BR: "inBrant",
  NG: "inNiagara",
  HM: "inHamilton",
  "7E4": "inEcoregion7E4",
  "Flowering Season": "floweringSeason",
  NatStatus: "natStatus",
  Invasive: "isInvasive",
  Family: "family",
  "Supplemental CC": "supplementalCc",
  "Supplemental CW": "supplementalCw",
  "CW Override": "cWOverride",
  "Reason for Override/Suppl. CW Rationalization": "verrideReason",
  Tracked: "isTracked",
  CCVI: "ccvi",
  "CCVI Confidence": "ccviConfidence",
  Tallgrass: "isTallgrass",
};

Papa.parse(csvFile, {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true,
  transformHeader: (header) => SOFIA_HEADER_MAP[header] || header,
  complete: (results) => {
    const output = `export const SOFIA_DATA = ${JSON.stringify(results.data, null, 2)};`;
    fs.writeFileSync("./sofiaData.js", output);
    console.log(
      `Successfully converted ${results.data.length} rows to /src/data/sofiaData.js`,
    );
  },
  error: (err) => {
    console.error("Error parsing CSV:", err);
  },
});
