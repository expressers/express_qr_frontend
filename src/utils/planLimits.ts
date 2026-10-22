import type { MyPlan, QrType } from "@/service/api";

/** Formata um limite de plano (-1 = ilimitado). */
export function formatLimit(limit: number | undefined, unlimitedLabel = "∞"): string {
  if (limit === undefined) return "—";
  return limit === -1 ? unlimitedLabel : String(limit);
}

/** Uso, limite e se o tipo já atingiu o limite do plano. */
export function getTypeUsage(myPlan: MyPlan | undefined, type: QrType) {
  const key = type === "STATIC" ? "static" : "dynamic";
  const used = myPlan?.usage[key] ?? 0;
  const limit = myPlan?.plan.maxQrCodes[type];
  const remaining = myPlan?.remaining[key];
  const atLimit = remaining !== undefined && remaining !== -1 && remaining <= 0;
  return { used, limit, remaining, atLimit };
}
