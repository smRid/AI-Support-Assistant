import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/isAuthorized";

export async function GET() {
  try {
    const user = await isAuthorized();

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error reading user session:", error);

    return NextResponse.json(
      { error: "Failed to read user session" },
      { status: 500 },
    );
  }
}
