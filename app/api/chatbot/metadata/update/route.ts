import { db } from "@/db/client";
import { chatBotMetadata } from "@/db/schema";
import { isAuthorized } from "@/lib/isAuthorized";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user = await isAuthorized();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const color =
      typeof body.color === "string" ? body.color.trim() : "";
    const welcome_message =
      typeof body.welcome_message === "string"
        ? body.welcome_message.trim()
        : "";

    if (!color || !welcome_message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [existingMetadata] = await db
      .select({ id: chatBotMetadata.id })
      .from(chatBotMetadata)
      .where(eq(chatBotMetadata.user_email, user.email))
      .limit(1);

    if (!existingMetadata) {
      const [createdMetadata] = await db
        .insert(chatBotMetadata)
        .values({
          user_email: user.email,
          color,
          welcome_message,
        })
        .returning();

      return NextResponse.json(createdMetadata, { status: 200 });
    }

    const [updatedMetadata] = await db
      .update(chatBotMetadata)
      .set({
        color,
        welcome_message,
      })
      .where(eq(chatBotMetadata.user_email, user.email))
      .returning();

    if (!updatedMetadata) {
      return NextResponse.json(
        { error: "Failed to update chatbot metadata" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedMetadata, { status: 200 });
  } catch (error) {
    console.error("Failed to update chatbot metadata:", error);
    return NextResponse.json(
      { error: "Failed to update chatbot metadata" },
      { status: 500 }
    );
  }
}
