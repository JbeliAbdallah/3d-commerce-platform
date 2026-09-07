"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-xl bg-brand-brown px-4 py-3 text-sm font-semibold text-brand-cream transition hover:bg-brand-brown/90"
    >
      <Printer size={18} />
      Imprimer
    </button>
  );
}
