export type BillCategory =
  | "Electricity"
  | "Cable TV"
  | "Internet"
  | "School Fees"
  | "Water Bill";

export type BillProvider = {
  name: string;
  shortName: string;
  domain: string;
  logo?: string;
};

export const billProviders: Record<BillCategory, BillProvider[]> = {
  Electricity: [
    { name: "Abuja Electricity Distribution Company", shortName: "AEDC", domain: "abujaelectricity.com" },
    { name: "Aba Power", shortName: "APLE", domain: "aba-power.com", logo: "/biller-logos/providers/aba-power.svg" },
    { name: "Benin Electricity Distribution Company", shortName: "BEDC", domain: "bedcpower.com", logo: "/biller-logos/providers/bedc.svg" },
    { name: "Eko Electricity Distribution Company", shortName: "EKEDC", domain: "ekedp.com", logo: "/biller-logos/eko.svg" },
    { name: "Enugu Electricity Distribution Company", shortName: "EEDC", domain: "enugudisco.com", logo: "/biller-logos/providers/eedc.svg" },
    { name: "Ibadan Electricity Distribution Company", shortName: "IBEDC", domain: "ibedc.com" },
    { name: "Ikeja Electric", shortName: "IKEDC", domain: "ikejaelectric.com" },
    { name: "Jos Electricity Distribution", shortName: "JED", domain: "jedplc.com" },
    { name: "Kaduna Electric", shortName: "KAEDCO", domain: "kadunaelectric.com" },
    { name: "Kano Electricity Distribution Company", shortName: "KEDCO", domain: "kedco.ng", logo: "/biller-logos/providers/kedco.svg" },
    { name: "Port Harcourt Electricity Distribution", shortName: "PHED", domain: "phed.com.ng" },
    { name: "Yola Electricity Distribution Company", shortName: "YEDC", domain: "yedc.com.ng", logo: "/biller-logos/providers/yedc.svg" },
  ],
  "Cable TV": [
    { name: "DStv", shortName: "DStv", domain: "dstv.com", logo: "/biller-logos/dstv.svg" },
    { name: "GOtv", shortName: "GOtv", domain: "gotvafrica.com", logo: "/biller-logos/gotv.svg" },
    { name: "StarTimes", shortName: "StarTimes", domain: "startimestv.com" },
    { name: "Showmax", shortName: "Showmax", domain: "showmax.com" },
  ],
  Internet: [
    { name: "Spectranet", shortName: "Spectranet", domain: "spectranet.com.ng" },
    { name: "Smile Communications", shortName: "Smile", domain: "smile.com.ng" },
    { name: "ipNX Nigeria", shortName: "ipNX", domain: "ipnxnigeria.net" },
    { name: "FibreOne Broadband", shortName: "FibreOne", domain: "fibreonebroadband.com", logo: "/biller-logos/providers/fibreone.svg" },
    { name: "Tizeti", shortName: "Tizeti", domain: "wifi.com.ng", logo: "/biller-logos/providers/tizeti.svg" },
    { name: "MTN Broadband", shortName: "MTN", domain: "mtn.ng" },
    { name: "Airtel Broadband", shortName: "Airtel", domain: "airtel.com.ng" },
    { name: "Glo Broadband", shortName: "Glo", domain: "gloworld.com", logo: "/biller-logos/providers/glo.svg" },
  ],
  "School Fees": [
    { name: "Joint Admissions and Matriculation Board", shortName: "JAMB", domain: "jamb.gov.ng" },
    { name: "West African Examinations Council", shortName: "WAEC", domain: "waecnigeria.org", logo: "/biller-logos/providers/waec.svg" },
    { name: "National Examinations Council", shortName: "NECO", domain: "neco.gov.ng" },
    { name: "University of Lagos", shortName: "UNILAG", domain: "unilag.edu.ng" },
    { name: "University of Ibadan", shortName: "UI", domain: "ui.edu.ng" },
    { name: "Covenant University", shortName: "Covenant", domain: "covenantuniversity.edu.ng" },
  ],
  "Water Bill": [
    { name: "Lagos Water Corporation", shortName: "LWC", domain: "lagoswater.org" },
    { name: "FCT Water Board", shortName: "FCT Water", domain: "fctwb.gov.ng" },
    { name: "Ogun State Water Corporation", shortName: "Ogun Water", domain: "ogunstate.gov.ng" },
    { name: "Kaduna State Water Corporation", shortName: "Kaduna Water", domain: "kdsg.gov.ng" },
    { name: "Oyo State Water Corporation", shortName: "Oyo Water", domain: "oyostate.gov.ng" },
    { name: "Rivers State Water Services", shortName: "Rivers Water", domain: "riversstate.gov.ng" },
  ],
};

export const billCategories = Object.keys(billProviders) as BillCategory[];

export function providerLogoUrl(provider: BillProvider) {
  return provider.logo ?? `/biller-logos/providers/${provider.domain.replaceAll(".", "-")}.png`;
}
