export type NigerianNetwork = "MTN" | "Airtel" | "Glo" | "9mobile";

const networkPrefixes: Record<NigerianNetwork, string[]> = {
  MTN: ["0703", "0706", "0803", "0806", "0810", "0813", "0814", "0816", "0903", "0906", "0913", "0916"],
  Airtel: ["0701", "0708", "0802", "0808", "0812", "0901", "0902", "0904", "0907", "0911", "0912"],
  Glo: ["0705", "0805", "0807", "0811", "0815", "0905", "0915"],
  "9mobile": ["0809", "0817", "0818", "0908", "0909"],
};

export function normalizeNigerianPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("234")) {
    return `0${digits.slice(3, 13)}`;
  }

  return digits.slice(0, 11);
}

export function detectNigerianNetwork(value: string): NigerianNetwork | null {
  const number = normalizeNigerianPhoneNumber(value);
  if (number.length < 4) return null;

  const prefix = number.slice(0, 4);
  return (
    (Object.entries(networkPrefixes).find(([, prefixes]) => prefixes.includes(prefix))?.[0] as NigerianNetwork | undefined) ??
    null
  );
}
