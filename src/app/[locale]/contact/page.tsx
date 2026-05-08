import { getTranslations } from "next-intl/server";
import { ContactForm } from "@/components/ContactForm";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/FadeIn";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations();
  return {
    title: t("contact.title"),
    description: t("contact.subtitle"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-12">
      <FadeIn>
        <section className="relative overflow-hidden rounded-xl border border-border bg-bg-2 p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-semibold tracking-tight text-text md:text-5xl">
              {t("contact.title")}
            </h1>
            <p className="mt-4 text-lg leading-8 text-text-2">
              {t("contact.subtitle")}
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-text/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-text/5 blur-3xl" />
        </section>
      </FadeIn>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <FadeInStagger className="flex flex-col gap-8 lg:col-span-1">
          <FadeIn>
            <div className="rounded-xl border border-border bg-surface-1 p-6 transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-text/5 text-text">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-text">Email</h3>
                  <p className="text-sm text-text-2">hello@cursor-cameroun.org</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-xl border border-border bg-surface-1 p-6 transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-text/5 text-text">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-text">WhatsApp</h3>
                  <p className="text-sm text-text-2">Rejoignez notre communauté</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="rounded-xl border border-border bg-surface-1 p-6 transition-transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-text/5 text-text">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-text">Localisation</h3>
                  <p className="text-sm text-text-2">Douala & Yaoundé, Cameroun</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </FadeInStagger>

        <FadeIn delay={0.2} className="lg:col-span-2">
          <ContactForm />
        </FadeIn>
      </div>
    </div>
  );
}
