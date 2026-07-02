import { supabase } from "@/lib/supabase";

export type HpRole = "admin" | "doctor" | "nurse" | "pharmacist" | "other";

export async function getHpUserRole(): Promise<HpRole> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return "other";

  const { data: facility } = await supabase
    .from("facilities")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (facility) return "admin";

  const { data: staff } = await supabase
    .from("hp_staff")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (staff?.role) {
    const r = staff.role.toLowerCase();
    if (r.includes("doctor") || r.includes("gp") || r.includes("specialist")) return "doctor";
    if (r.includes("nurse")) return "nurse";
    if (r.includes("pharmacist")) return "pharmacist";
  }

  return "other";
}

export function hasHpAccess(module: string, role: HpRole): boolean {
  const access: Record<string, HpRole[]> = {
    opd: ["admin", "doctor", "nurse"],
    admissions: ["admin", "doctor", "nurse"],
    pharmacy: ["admin", "doctor", "nurse", "pharmacist"],
    clinical: ["admin", "doctor"],
    patients: ["admin", "doctor", "nurse"],
    billing: ["admin"],
    analytics: ["admin", "doctor"],
    team: ["admin"],
  };
  return access[module]?.includes(role) ?? false;
}
