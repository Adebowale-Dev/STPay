const bankLogoCodes = new Set([
  "00103",
  "011",
  "032",
  "033",
  "035",
  "044",
  "050",
  "057",
  "058",
  "070",
  "076",
  "082",
  "101",
  "105",
  "214",
  "221",
  "232",
  "301",
  "50211",
  "50515",
  "999991",
  "999992",
]);

export function getBankLogo(code: string) {
  if (code === "STPAY") return "/bank-logos/stpay.svg";
  if (code === "001") return "/bank-logos/test-bank.svg";
  if (bankLogoCodes.has(code)) return `/bank-logos/${code}.${["011", "076", "214", "221"].includes(code) ? "svg" : "png"}`;
  return "/bank-logos/bank.svg";
}
