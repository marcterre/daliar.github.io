import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { colorHex } = await req.json();

  try {
    const { data, error } = await supabase
      .from("backgroundColor")
      .upsert({
        id: 1,
        colorHex: colorHex,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { message: "Background color saved successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving background color:", error);
    return NextResponse.json(
      { error: "Failed to save background color" },
      { status: 500 }
    );
  }
}
