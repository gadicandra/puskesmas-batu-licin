"use client";

import type { ReactNode } from "react";
import type { PengaduanFormErrors, PengaduanFormValues } from "./types";

interface PengaduanFormFieldsProps {
  values: PengaduanFormValues;
  errors: PengaduanFormErrors;
  onChange: (field: keyof PengaduanFormValues, value: string) => void;
  idPrefix: string;
}

const fieldBaseClass =
  "min-h-12 w-full rounded-lg border border-pengaduan-accent bg-white px-5 py-3 text-base font-bold text-pengaduan-dark placeholder:text-pengaduan-dark/80 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pengaduan-lime focus-visible:ring-offset-2 focus-visible:ring-offset-pengaduan-dark";

export default function PengaduanFormFields({
  values,
  errors,
  onChange,
  idPrefix,
}: PengaduanFormFieldsProps) {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">Data pesan</legend>

      <FormField
        id={`${idPrefix}-name`}
        label="Nama *"
        error={errors.name}
      >
        <input
          id={`${idPrefix}-name`}
          name="name"
          type="text"
          autoComplete="name"
          spellCheck={false}
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Contoh: Budi Santoso"
          aria-invalid={errors.name ? "true" : undefined}
          aria-describedby={errors.name ? `${idPrefix}-name-error` : undefined}
          className={fieldBaseClass}
        />
      </FormField>

      <FormField
        id={`${idPrefix}-contact`}
        label="Email / Nomor Telepon *"
        error={errors.contact}
      >
        <input
          id={`${idPrefix}-contact`}
          name="contact"
          type="text"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          value={values.contact}
          onChange={(event) => onChange("contact", event.target.value)}
          placeholder="nama@email.com atau 0812..."
          aria-invalid={errors.contact ? "true" : undefined}
          aria-describedby={errors.contact ? `${idPrefix}-contact-error` : undefined}
          className={fieldBaseClass}
        />
      </FormField>

      <FormField
        id={`${idPrefix}-subject`}
        label="Subjek *"
        error={errors.subject}
      >
        <input
          id={`${idPrefix}-subject`}
          name="subject"
          type="text"
          autoComplete="off"
          value={values.subject}
          onChange={(event) => onChange("subject", event.target.value)}
          placeholder="Ringkasan pesan"
          aria-invalid={errors.subject ? "true" : undefined}
          aria-describedby={errors.subject ? `${idPrefix}-subject-error` : undefined}
          className={fieldBaseClass}
        />
      </FormField>

      <FormField
        id={`${idPrefix}-message`}
        label="Pesan *"
        error={errors.message}
      >
        <textarea
          id={`${idPrefix}-message`}
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => onChange("message", event.target.value)}
          placeholder="Tuliskan pesan Anda"
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${idPrefix}-message-error` : undefined}
          className={`${fieldBaseClass} min-h-[132px] resize-y`}
        />
      </FormField>
    </fieldset>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-black text-white">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm font-bold text-white" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
