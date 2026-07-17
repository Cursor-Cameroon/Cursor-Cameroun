import { NextResponse } from "next/server";
import { getEvents, createEvent, eventExists, type Event } from "@/data/events";
import { isAuthenticated } from "@/lib/auth";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newEvent: Event = await request.json();

    // Simple validation: check if slug already exists
    if (await eventExists(newEvent.slug)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    await createEvent(newEvent);

            // Send notification email
    if (resend) {
      try {
        const origin = new URL(request.url).origin;
        const eventLink = `${origin}/events/${newEvent.slug}`;
        
        await resend.emails.send({
          from: "Cursor Cameroun <onboarding@resend.dev>",
          to: [process.env.CONTACT_EMAIL || "hello@cursor-cameroun.org"],
          subject: `[Admin] Nouvel événement créé : ${newEvent.name}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; color: #000000;">
              <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; border-bottom: 1px solid #e5e5e5; padding-bottom: 12px;">Nouvel événement ajouté</h2>
              <p><strong>Nom:</strong> ${newEvent.name}</p>
              <p><strong>Date:</strong> ${newEvent.startDateISO}${newEvent.endDateISO !== newEvent.startDateISO ? ` → ${newEvent.endDateISO}` : ""}</p>
              <p><strong>Ville:</strong> ${newEvent.city}</p>
              <p><strong>Description:</strong> ${newEvent.shortDescription}</p>
              <div style="margin-top: 24px; padding: 16px; background-color: #f5f5f5; border-radius: 4px;">
                <p style="margin: 0 0 12px 0;">L'événement a été ajouté avec succès à la base de données.</p>
                <a href="${eventLink}" style="display: inline-block; padding: 10px 18px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">
                  Voir l'événement
                </a>
              </div>
            </div>
          `,
        });
      } catch (err) {
        console.error("Failed to send notification email:", err);
      }
    } else {
      console.log("MOCK NOTIFICATION: New event created", newEvent.name);
    }

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: "Invalid data", details: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}
