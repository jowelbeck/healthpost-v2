import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_URL = "https://healthpost.africa";

async function sendSequenceEmail(email: string, name: string, type: string) {
  await fetch(`${BASE_URL}/api/send-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, type }),
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const { data: users } = await supabase.auth.admin.listUsers();
  if (!users) return NextResponse.json({ sent: 0 });

  let sent = 0;

  for (const user of users.users) {
    const signedUp = new Date(user.created_at);
    const daysSince = Math.floor((now.getTime() - signedUp.getTime()) / (1000 * 60 * 60 * 24));
    const email = user.email!;

    const { data: facility } = await supabase
      .from("facilities")
      .select("name")
      .eq("user_id", user.id)
      .maybeSingle();

    const name = facility?.name || user.user_metadata?.full_name || "Doctor";

    if (daysSince === 3) {
      await sendSequenceEmail(email, name, "day3");
      sent++;
    } else if (daysSince === 7) {
      await sendSequenceEmail(email, name, "day7");
      sent++;
    } else if (daysSince === 14) {
      await sendSequenceEmail(email, name, "day14");
      sent++;
    } else if (daysSince === 28) {
      await sendSequenceEmail(email, name, "day28");
      sent++;
    }
  }

  return NextResponse.json({ success: true, sent, checked: users.users.length });
}
