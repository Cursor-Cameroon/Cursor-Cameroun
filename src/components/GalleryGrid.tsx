"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption?: string;
  eventSlug: string;
  eventName: string;
  startDateISO: string;
  endDateISO: string;
  city: string;
};

function formatEventDateRange(startDateISO: string, endDateISO: string) {
  return startDateISO === endDateISO ? startDateISO : `${startDateISO} → ${endDateISO}`;
}

export function GalleryGrid({
  photos,
}: {
  photos: GalleryPhoto[];
}) {
  const t = useTranslations();
  const [openId, setOpenId] = useState<string | null>(null);
  const current = useMemo(
    () => photos.find((p) => `${p.eventSlug}-${p.src}` === openId) ?? null,
    [openId, photos],
  );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {photos.map((p) => (
          <button
            key={`${p.eventSlug}-${p.src}`}
            type="button"
            className="group overflow-hidden rounded-md border border-border bg-bg-2 text-left"
            onClick={() => setOpenId(`${p.eventSlug}-${p.src}`)}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={900}
              height={700}
              className="h-auto w-full object-cover transition-opacity group-hover:opacity-90"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="p-3">
              <div className="text-xs font-medium text-text">{p.eventName}</div>
              <div className="mt-1 text-xs text-text-2">
                {p.city} · {formatEventDateRange(p.startDateISO, p.endDateISO)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t("gallery.lightboxLabel")}
          onClick={() => setOpenId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg border border-border bg-bg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="text-sm font-medium text-text">
                  {current.eventName}
                </div>
                <div className="text-xs text-text-2">
                  {current.city} · {formatEventDateRange(current.startDateISO, current.endDateISO)}
                </div>
              </div>
              <button
                type="button"
                className="rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text hover:bg-surface-2"
                onClick={() => setOpenId(null)}
              >
                {t("gallery.close")}
              </button>
            </div>
            <div className="bg-black">
              <Image
                src={current.src}
                alt={current.alt}
                width={1600}
                height={1200}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
            <div className="px-4 py-3 text-sm text-text-2">{current.caption}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}

