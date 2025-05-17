import { NextResponse } from "next/server";

export async function GET() {
  const data = `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_API_KEY}`;
  const response = await fetch(data);
  if (!response.ok) {
    console.error("Error fetching fonts:", response.statusText);
    return NextResponse.json({ error: response.statusText }, { status: 500 });
  }
  return NextResponse.json(await response.json());
}
