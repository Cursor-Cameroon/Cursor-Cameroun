"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Event } from "@/data/events";
import { Plus, Trash2 } from "lucide-react";

const eventSchema = z.object({
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  startDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  endDateISO: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  city: z.string().min(2, "City is required"),
  venue: z.string().optional(),
  shortDescription: z.string().min(10, "Description must be at least 10 characters"),
  participants: z.number().optional(),
  status: z.enum(["upcoming", "past", "ongoing"]),
  lumaUrl: z.string().url().optional().or(z.literal("")),
  gallery: z.array(z.object({
    src: z.string().min(1, "Source is required"),
    alt: z.string().min(1, "Alt text is required"),
    caption: z.string().optional(),
  })).optional(),
  coverImage: z.string().optional(),
  about: z.string().optional(),
}).refine((data) => data.endDateISO >= data.startDateISO, {
  message: "La date de fin doit être postérieure ou égale à la date de début",
  path: ["endDateISO"],
});

type EventFormValues = z.infer<typeof eventSchema>;

type EventFormProps = {
  initialData?: Event;
  onSubmit: (data: Event) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
};

export function EventForm({ initialData, onSubmit, onCancel, isSubmitting }: EventFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startDateISO: initialData.startDateISO || initialData.dateISO || "",
          endDateISO: initialData.endDateISO || initialData.dateISO || "",
        }
      : {
          status: "upcoming",
          participants: 0,
          gallery: [],
          startDateISO: "",
          endDateISO: "",
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "gallery",
  });

  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      alert("La configuration Cloudinary est manquante (.env)");
      return null;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Erreur d'upload");
      return data.secure_url;
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur d'upload");
      return null;
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit({ ...data, dateISO: data.startDateISO }))}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Slug</label>
          <input
            {...register("slug")}
            placeholder="cafe-cursor-yaounde-02"
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.slug && <span className="text-[10px] text-text-2">{errors.slug.message as string}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Nom</label>
          <input
            {...register("name")}
            placeholder="Nom de l'événement"
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.name && <span className="text-[10px] text-text-2">{errors.name.message as string}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Date de début (YYYY-MM-DD)</label>
          <input
            {...register("startDateISO")}
            placeholder="2026-05-15"
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.startDateISO && <span className="text-[10px] text-text-2">{errors.startDateISO.message as string}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Date de fin (YYYY-MM-DD)</label>
          <input
            {...register("endDateISO")}
            placeholder="2026-05-16"
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.endDateISO && <span className="text-[10px] text-text-2">{errors.endDateISO.message as string}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Ville</label>
          <input
            {...register("city")}
            placeholder="Yaoundé"
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.city && <span className="text-[10px] text-text-2">{errors.city.message as string}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Lieu</label>
          <input
            {...register("venue")}
            placeholder="Lieu à confirmer"
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Statut</label>
          <select
            {...register("status")}
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="upcoming">À venir</option>
            <option value="ongoing">En cours</option>
            <option value="past">Passé</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Participants</label>
          <input
            type="number"
            {...register("participants", {
              setValueAs: (value) =>
                value === "" || Number.isNaN(Number(value))
                  ? undefined
                  : Number(value),
            })}
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Luma URL</label>
          <input
            {...register("lumaUrl")}
            placeholder="https://lu.ma/..."
            className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {errors.lumaUrl && <span className="text-[10px] text-text-2">{errors.lumaUrl.message as string}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-text-2">Image de Couverture (URL)</label>
          <div className="flex gap-2">
            <input
              {...register("coverImage")}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <label className="cursor-pointer rounded-md border border-border bg-surface-1 px-3 py-2 text-sm font-medium text-text hover:bg-surface-2 disabled:opacity-50 flex items-center justify-center">
              {uploading ? "..." : "Upload"}
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await uploadToCloudinary(file);
                    if (url) {
                      setValue("coverImage", url);
                    }
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-2">Description courte</label>
        <textarea
          {...register("shortDescription")}
          rows={2}
          className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
        />
        {errors.shortDescription && <span className="text-[10px] text-text-2">{errors.shortDescription.message as string}</span>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-text-2">À propos (description longue)</label>
        <textarea
          {...register("about")}
          rows={4}
          placeholder="Contexte, objectifs, déroulement détaillé de l'événement..."
          className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Gallery Section */}
      <div className="flex flex-col gap-4 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-text">Galerie Photos</label>
          <button
            type="button"
            onClick={() => append({ src: "", alt: "", caption: "" })}
            className="inline-flex items-center gap-1 text-xs font-medium text-text-2 hover:text-text transition-colors"
          >
            <Plus size={14} />
            Ajouter une photo
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {fields.map((field, index) => (
            <div key={field.id} className="relative group rounded-md border border-border bg-bg-2 p-4">
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-2 right-2 p-1 rounded-md bg-surface-1 text-text-2 hover:text-text opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={14} />
              </button>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-text-2 uppercase">Source (URL ou Chemin)</label>
                  <div className="flex gap-1">
                    <input
                      {...register(`gallery.${index}.src`)}
                      placeholder="https://..."
                      className="flex-1 min-w-0 rounded-md border border-border bg-surface-1 px-2 py-1.5 text-xs text-text focus:outline-none"
                    />
                    <label className="cursor-pointer rounded-md border border-border bg-surface-1 px-2 py-1.5 text-xs font-medium text-text hover:bg-surface-2 disabled:opacity-50 flex items-center justify-center">
                      ↑
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadToCloudinary(file);
                            if (url) {
                              setValue(`gallery.${index}.src`, url);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-text-2 uppercase">Alt Text</label>
                  <input
                    {...register(`gallery.${index}.alt`)}
                    placeholder="Description de l'image"
                    className="rounded-md border border-border bg-surface-1 px-2 py-1.5 text-xs text-text focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-medium text-text-2 uppercase">Légende</label>
                  <input
                    {...register(`gallery.${index}.caption`)}
                    placeholder="Légende affichée"
                    className="rounded-md border border-border bg-surface-1 px-2 py-1.5 text-xs text-text focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          {fields.length === 0 && (
            <p className="text-center text-xs text-text-2 py-4 border border-dashed border-border rounded-md">
              Aucune photo dans la galerie.
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-text hover:bg-surface-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Event"}
        </button>
      </div>
    </form>
  );
}
