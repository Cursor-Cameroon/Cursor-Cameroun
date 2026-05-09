import { NextResponse } from "next/server";
import { getEvents, saveEvents, type Event } from "@/data/events";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const updatedEvent: Event = await request.json();
    const events = getEvents();
    
    const index = events.findIndex(e => e.slug === slug);
    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    events[index] = { ...events[index], ...updatedEvent };
    saveEvents(events);
    return NextResponse.json(events[index]);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: "Invalid data", details: error instanceof Error ? error.message : String(error) }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    let events = getEvents();
    
    const initialLength = events.length;
    events = events.filter(e => e.slug !== slug);
    
    if (events.length === initialLength) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    saveEvents(events);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
