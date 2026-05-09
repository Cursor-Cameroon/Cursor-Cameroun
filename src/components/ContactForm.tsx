"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError(t("contact.errorBody"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface-1 p-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2 text-text">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-semibold text-text">
          {t("contact.successTitle")}
        </h3>
        <p className="mt-2 text-text-2">{t("contact.successBody")}</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-8 rounded-md bg-text px-6 py-2 text-sm font-medium text-bg hover:opacity-90"
        >
          {t("contact.sendAnother")}
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface-1 p-1 md:p-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-6 md:p-8"
      >
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-text-2">
              {t("contact.formName")}
            </label>
            <input
              {...register("name")}
              id="name"
              className={`rounded-md border bg-bg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 ${
                errors.name ? "border-text ring-text/20" : "border-border focus:ring-ring/20"
              }`}
            />
            {errors.name && (
              <span className="text-xs text-text-2">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-text-2">
              {t("contact.formEmail")}
            </label>
            <input
              {...register("email")}
              id="email"
              type="email"
              className={`rounded-md border bg-bg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 ${
                errors.email ? "border-text ring-text/20" : "border-border focus:ring-ring/20"
              }`}
            />
            {errors.email && (
              <span className="text-xs text-text-2">{errors.email.message}</span>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="flex flex-col gap-2">
          <label htmlFor="subject" className="text-sm font-medium text-text-2">
            {t("contact.formSubject")}
          </label>
          <input
            {...register("subject")}
            id="subject"
            className={`rounded-md border bg-bg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 ${
              errors.subject ? "border-text ring-text/20" : "border-border focus:ring-ring/20"
            }`}
          />
          {errors.subject && (
            <span className="text-xs text-text-2">{errors.subject.message}</span>
          )}
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-medium text-text-2">
            {t("contact.formMessage")}
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={5}
            className={`resize-none rounded-md border bg-bg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 ${
              errors.message ? "border-text ring-text/20" : "border-border focus:ring-ring/20"
            }`}
          />
          {errors.message && (
            <span className="text-xs text-text-2">{errors.message.message}</span>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-text"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative mt-2 flex items-center justify-center gap-2 overflow-hidden rounded-md bg-text px-6 py-3 text-sm font-medium text-bg transition-all hover:opacity-90 disabled:opacity-70"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("contact.formSending")}
            </>
          ) : (
            <>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              {t("contact.formSubmit")}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
