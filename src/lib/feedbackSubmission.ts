import { NextResponse } from "next/server";

export type FeedbackKind = "pengaduan" | "kritik-saran";

export interface FeedbackPayload {
  name: string;
  contact: string;
  subject: string;
  message: string;
}

type FeedbackErrors = Partial<Record<keyof FeedbackPayload, string>>;

const defaultCompanyEmail = "puskesmasbatulicin@yahoo.com";
const defaultCompanyPhone = "(0518) 123-456";

export async function handleFeedbackSubmission(request: Request, kind: FeedbackKind) {
  let payload: Partial<FeedbackPayload>;

  try {
    payload = (await request.json()) as Partial<FeedbackPayload>;
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Format data tidak valid. Muat ulang halaman lalu coba kirim kembali.",
      },
      { status: 400 },
    );
  }

  const values = normalizePayload(payload);
  const errors = validatePayload(values);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        success: false,
        message: "Form harus terisi semua sebelum pesan dikirim.",
        errors,
      },
      { status: 400 },
    );
  }

  try {
    await sendCompanyNotification(kind, values);

    return NextResponse.json(
      {
        success: true,
        message:
          kind === "pengaduan"
            ? "Pengaduan berhasil terkirim."
            : "Kritik dan saran berhasil terkirim.",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Pesan belum bisa dikirim. Periksa koneksi internet lalu coba lagi.",
      },
      { status: 503 },
    );
  }
}

function normalizePayload(payload: Partial<FeedbackPayload>): FeedbackPayload {
  return {
    name: String(payload.name ?? "").trim(),
    contact: String(payload.contact ?? "").trim(),
    subject: String(payload.subject ?? "").trim(),
    message: String(payload.message ?? "").trim(),
  };
}

function validatePayload(values: FeedbackPayload): FeedbackErrors {
  const errors: FeedbackErrors = {};

  if (!values.name) {
    errors.name = "Nama wajib diisi.";
  }

  if (!values.contact) {
    errors.contact = "Email atau nomor telepon wajib diisi.";
  } else if (!isValidContact(values.contact)) {
    errors.contact = "Masukkan email atau nomor telepon yang valid.";
  }

  if (!values.subject) {
    errors.subject = "Subjek wajib diisi.";
  }

  if (!values.message) {
    errors.message = "Pesan wajib diisi.";
  }

  return errors;
}

export function isValidContact(value: string) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const normalizedPhone = value.replace(/[\s()-]/g, "");
  const phonePattern = /^(\+62|62|0)?[0-9]{8,14}$/;

  return emailPattern.test(value) || phonePattern.test(normalizedPhone);
}

export async function sendCompanyNotification(kind: FeedbackKind, values: FeedbackPayload) {
  const companyEmail = process.env.COMPANY_FEEDBACK_EMAIL || defaultCompanyEmail;
  const companyPhone = process.env.COMPANY_FEEDBACK_PHONE || defaultCompanyPhone;
  const label = kind === "pengaduan" ? "Pengaduan" : "Kritik dan Saran";
  const submittedAt = new Date().toISOString();
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;

  const notificationPayload = {
    type: kind,
    label,
    companyEmail,
    companyPhone,
    submittedAt,
    sender: {
      name: values.name,
      contact: values.contact,
    },
    subject: values.subject,
    message: values.message,
  };

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notificationPayload),
    });

    if (!response.ok) {
      throw new Error("Pesan belum bisa dikirim ke perusahaan. Periksa koneksi lalu coba lagi.");
    }

    return;
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("Layanan pengiriman pesan belum dikonfigurasi.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.FEEDBACK_FROM_EMAIL || "Puskesmas Batulicin <onboarding@resend.dev>",
      to: [companyEmail],
      subject: label,
      text: [
        `Jenis: ${label}`,
        `Dikirim pada: ${submittedAt}`,
        `Tujuan perusahaan: ${companyEmail} / ${companyPhone}`,
        "",
        `Nama: ${values.name}`,
        `Kontak: ${values.contact}`,
        `Subjek: ${values.subject}`,
        "",
        values.message,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    throw new Error("Pesan belum bisa dikirim ke email perusahaan. Periksa koneksi lalu coba lagi.");
  }
}
