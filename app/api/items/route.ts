import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();
  const { data: items, error } = await supabase.from("items").select("*");

  if (error) {
    console.error("Error fetching items:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(items);
}
