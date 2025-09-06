import "server-only"
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { userSchema } from "../schemas";
import { cache } from "react";
import { jwtVerify } from "jose"

export const verifySession = cache(async () => {
  const token = (await cookies()).get("50TA_TOKEN")?.value;
  if (!token) redirect("/auth/login");

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    
    const parsed = userSchema.safeParse(payload);
    if (!parsed.success) redirect("/auth/login");

    return {
      user: parsed.data,
      token: true,
    };
  } catch {
    redirect("/auth/login");
  }
})

export async function VerifyRole(allowed: ("cotizador" | "comprador" | "admin" | "unassigned")[]) {
    const { user } = await verifySession();

    if (!allowed.includes(user.rol)) {
        redirect("/errors/403");
    }

    return { user };
}