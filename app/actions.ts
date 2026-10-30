"use server";

import { cookies } from "next/headers";
import { CUSTOMER_COOKIE } from "@/lib/customer-cookie";
import { normalizeCustomerCode } from "@/lib/customers";

/**
 * Switches the customer the store prices for. Setting the cookie re-renders
 * the current page on the server, so every price updates.
 */
export async function setCustomer(value: string | null): Promise<void> {
  const store = await cookies();
  const code = normalizeCustomerCode(value);
  if (code) {
    store.set(CUSTOMER_COOKIE, code, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    store.delete(CUSTOMER_COOKIE);
  }
}
