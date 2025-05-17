import { createClient } from "@/utils/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const items = await req.json();

  try {
    const { error } = await supabase.from("items").insert(items);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Items saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving items:", error);
    return NextResponse.json(
      { error: "Failed to save items" },
      { status: 500 }
    );
  }
}
