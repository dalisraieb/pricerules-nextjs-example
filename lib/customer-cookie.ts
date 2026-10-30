import "server-only";
import { cookies } from "next/headers";
import { normalizeCustomerCode } from "./customers";

// The selected customer lives in a cookie so pages price on the server.
// In a real portal it would come from the signed-in user's company instead,
// never from something the buyer can edit.

export const CUSTOMER_COOKIE = "customer";

/** The selected customer's code, or null for a guest. */
export async function getCustomerCode(): Promise<string | null> {
  const store = await cookies();
  return normalizeCustomerCode(store.get(CUSTOMER_COOKIE)?.value);
}
