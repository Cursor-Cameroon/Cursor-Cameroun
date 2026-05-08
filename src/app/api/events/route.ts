import { NextResponse } from "next/server";
import { getEvents, saveEvents, type Event } from "@/data/events";

export async function GET() {
  const events = getEvents();
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  try {
    const newEvent: Event = await request.json();
    const events = getEvents();
    
    // Simple validation: check if slug already exists
    if (events.find(e => e.slug === newEvent.slug)) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }

    events.push(newEvent);
    saveEvents(events);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
}
