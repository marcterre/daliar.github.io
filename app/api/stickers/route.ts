import { createClient } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: sticker, error } = await supabase.from("sticker").select("*");

  if (error) {
    console.error("Error fetching stickers:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(sticker);
}
