"use client";

import { useState, useEffect } from "react";
import { type Event } from "@/data/events";
import { EventForm } from "@/components/admin/EventForm";
import { FadeIn } from "@/components/FadeIn";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: any) {
    setIsSubmitting(true);
    try {
      const url = editingEvent ? `/api/events/${editingEvent.slug}` : "/api/events";
      const method = editingEvent ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        await fetchEvents();
        setIsModalOpen(false);
        setEditingEvent(undefined);
      } else {
        const error = await res.json();
        alert(error.error || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Failed to save event", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) return;

    try {
      const res = await fetch(`/api/events/${slug}`, { method: "DELETE" });
      if (res.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Failed to delete event", error);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <FadeIn>
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-text">
              Administration des Événements
            </h1>
            <p className="text-sm text-text-2">
              Gérez les événements de la communauté Cursor Cameroun.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingEvent(undefined);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-md bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Nouvel Événement
          </button>
        </header>
      </FadeIn>

      <div className="rounded-lg border border-border bg-surface-1 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-2 text-text-2 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-medium">Nom</th>
              <th className="px-6 py-4 font-medium">Ville / Date</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-text-2">
                  Chargement...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-text-2">
                  Aucun événement trouvé.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.slug} className="hover:bg-surface-2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-text">{event.name}</span>
                      <span className="text-xs text-text-2">{event.slug}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-text">{event.city}</span>
                      <span className="text-xs text-text-2">{event.dateISO}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      event.status === "ongoing"
                        ? "bg-text text-bg" 
                        : event.status === "upcoming" 
                          ? "bg-surface-2 text-text border border-border" 
                          : "bg-surface-1 text-text-2 border border-border"
                    }`}>
                      {event.status === "ongoing" ? "En cours" : event.status === "upcoming" ? "À venir" : "Passé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-md hover:bg-border text-text-2 hover:text-text transition-colors"
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.slug)}
                        className="p-1.5 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 text-text-2 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-bg/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface-1 p-8 shadow-2xl animate-fadeInUp">
            <header className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">
                {editingEvent ? "Modifier l'événement" : "Créer un événement"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-2 hover:text-text transition-colors"
              >
                <Plus size={20} className="rotate-45" />
              </button>
            </header>
            
            <EventForm
              initialData={editingEvent}
              onSubmit={handleSubmit}
              onCancel={() => setIsModalOpen(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
}
