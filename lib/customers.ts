// The accounts in the customer switcher. In a real portal the signed-in
// user's company gives you the customer code; here a visitor picks one.
// The codes are PriceRules' onboarding sample customers.

export type Account = {
  code: string;
  name: string;
  /** What this account shows off in the demo. */
  note: string;
};

export const ACCOUNTS: Account[] = [
  {
    code: "ACME-BUILD",
    name: "Acme Construction GmbH",
    note: "Contract prices, a volume break on bolts, contractor valve discount",
  },
  {
    code: "SUMMIT-ENG",
    name: "Summit Engineering SARL",
    note: "Contractor valve discount, bulk gloves from 100",
  },
  {
    code: "HARBOR-SUP",
    name: "Harbor Supply Co.",
    note: "A dated promotion on safety glasses",
  },
];

/** The longest customer code the switcher accepts. */
export const MAX_CODE_LENGTH = 80;

/** A customer code from user input, or null for a guest (no customer). */
export function normalizeCustomerCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const code = value.trim();
  if (!code || code.length > MAX_CODE_LENGTH) return null;
  return code;
}

export function findAccount(code: string | null): Account | undefined {
  return ACCOUNTS.find((account) => account.code === code);
}
