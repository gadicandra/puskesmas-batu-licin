"use client";

import { useState, type FormEvent } from "react";
import PengaduanFormFields from "./PengaduanFormFields";
import PengaduanSuccessState from "./PengaduanSuccessState";
import type { PengaduanFormErrors, PengaduanFormValues } from "./types";

const initialValues: PengaduanFormValues = {
  name: "",
  contact: "",
  subject: "",
  message: "",
};

interface FormPengaduanPanelProps {
  variant?: "dark" | "light";
  endpoint: "/api/pengaduan" | "/api/kritik-saran";
  idPrefix: string;
  successTitle: string;
  successDescription: string;
}

interface FeedbackResponse {
  success?: boolean;
  message?: string;
  errors?: unknown;
  data?: {
    errors?: unknown;
  };
}

export default function FormPengaduanPanel({
  variant = "dark",
  endpoint,
  idPrefix,
  successTitle,
  successDescription,
}: FormPengaduanPanelProps) {
  const [values, setValues] = useState<PengaduanFormValues>(initialValues);
  const [errors, setErrors] = useState<PengaduanFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const updateValue = (field: keyof PengaduanFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError(null);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setFormError(null);
    setIsSuccess(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validateValues(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setFormError("Form harus terisi semua sebelum pesan dikirim.");
      requestAnimationFrame(() => {
        const firstInvalid = document.querySelector<HTMLElement>(
          `#${idPrefix}-name[aria-invalid="true"], #${idPrefix}-contact[aria-invalid="true"], #${idPrefix}-subject[aria-invalid="true"], #${idPrefix}-message[aria-invalid="true"]`,
        );
        firstInvalid?.focus();
      });
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = (await response.json().catch(() => ({}))) as FeedbackResponse;

      if (!response.ok) {
        const responseErrors = normalizePayloadErrors(
          result.data?.errors ?? result.errors,
        );

        if (Object.keys(responseErrors).length > 0) {
          setErrors(responseErrors);
        }

        throw new Error(
          result.message || "Pesan belum bisa dikirim. Periksa koneksi lalu coba lagi.",
        );
      }

      setIsSuccess(true);
    } catch (submitError) {
      setFormError(getSubmitErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const panelClass =
    variant === "dark"
      ? "bg-pengaduan-dark"
      : "bg-pengaduan-light";

  const buttonClass =
    variant === "dark"
      ? "bg-pengaduan-lime text-pengaduan-dark hover:bg-pengaduan-pill hover:text-white"
      : "bg-pengaduan-dark text-white hover:bg-pengaduan-pill";

  return (
    <section
      className={`mx-auto w-full max-w-5xl rounded-[24px] px-6 py-8 sm:rounded-[28px] sm:px-10 sm:py-12 lg:px-14 ${panelClass}`}
      aria-labelledby={`${idPrefix}-heading`}
    >
      <h2 id={`${idPrefix}-heading`} className="sr-only">
        {variant === "dark" ? "Form Pengaduan" : "Kritik dan Saran"}
      </h2>

      {isSuccess ? (
        <PengaduanSuccessState
          title={successTitle}
          description={successDescription}
          onReset={resetForm}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting}>
          <PengaduanFormFields
            values={values}
            errors={errors}
            onChange={updateValue}
            idPrefix={idPrefix}
          />

          {formError && (
            <div
              className="rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm font-bold text-white"
              role="alert"
              aria-live="polite"
            >
              {formError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-black transition disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-pengaduan-dark ${buttonClass}`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </section>
  );
}

function validateValues(values: PengaduanFormValues): PengaduanFormErrors {
  const errors: PengaduanFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Nama wajib diisi.";
  }

  if (!values.contact.trim()) {
    errors.contact = "Email atau nomor telepon wajib diisi.";
  } else if (!isValidContact(values.contact.trim())) {
    errors.contact = "Masukkan email atau nomor telepon yang valid.";
  }

  if (!values.subject.trim()) {
    errors.subject = "Subjek wajib diisi.";
  }

  if (!values.message.trim()) {
    errors.message = "Pesan wajib diisi.";
  }

  return errors;
}

function isValidContact(value: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[+()\d\s-]{8,}$/;

  return emailPattern.test(value) || phonePattern.test(value);
}

function getSubmitErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Pesan belum bisa dikirim. Periksa koneksi internet lalu coba lagi.";
  }

  if (
    error.name === "TypeError" ||
    error.message.toLowerCase().includes("fetch") ||
    error.message.toLowerCase().includes("network")
  ) {
    return "Pesan belum bisa dikirim karena koneksi atau sinyal tidak stabil. Coba lagi sebentar.";
  }

  return error.message;
}

function normalizePayloadErrors(details: unknown): PengaduanFormErrors {
  if (!details || typeof details !== "object") {
    return {};
  }

  if (!Array.isArray(details)) {
    return Object.fromEntries(
      Object.entries(details).filter(
        ([field, message]) =>
          ["name", "contact", "subject", "message"].includes(field) &&
          typeof message === "string",
      ),
    ) as PengaduanFormErrors;
  }

  const fields: Array<keyof PengaduanFormValues> = ["name", "contact", "subject", "message"];

  return details.reduce<PengaduanFormErrors>((errors, detail) => {
    if (!detail || typeof detail !== "object") {
      return errors;
    }

    const path = "path" in detail && typeof detail.path === "string" ? detail.path : undefined;
    const message =
      "message" in detail && typeof detail.message === "string" ? detail.message : undefined;
    const field = fields.find((candidate) => path?.endsWith(candidate));

    if (field && message) {
      errors[field] = message;
    }

    return errors;
  }, {});
}
