import { chatBotMetadata } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { SignJWT } from 'jose';
import { db } from "@/db/client";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    const { widget_id } = await req.json();

    if (!widget_id) {
      return NextResponse.json(
        { error: "Missing widget_id" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Verify widget exists
    const [bot] = await db
      .select()
      .from(chatBotMetadata)
      .where(eq(chatBotMetadata.id, widget_id))
      .limit(1);

    if (!bot) {
      return NextResponse.json(
        { error: "Widget not found" },
        { status: 404, headers: CORS_HEADERS }
      );
    }


    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const sessionId = crypto.randomUUID();

    const token = await new SignJWT({widgetId: bot.id, ownerEmail: bot.user_email, sessionId})
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

    return NextResponse.json({ token }, { headers: CORS_HEADERS });
  } catch (error) {
    console.error("Session Error:", error);
    return NextResponse.json(
        { error: "Internal Server Error" }, 
        { status: 500, headers: CORS_HEADERS });
  }
}
