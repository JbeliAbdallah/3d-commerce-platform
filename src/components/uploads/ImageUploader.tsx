"use client";
import Image from "next/image";
import { useRef, useState } from "react";

type ImageUploaderProps = {
  value?: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Upload échoué.");
      }

      onChange(data.secure_url);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer l'image.",
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div>
      {value ? (
        <div className="mb-4 overflow-hidden rounded-xl border border-brand-brown/10">
          <Image
            src={value}
            alt="Aperçu"
            width={800}
            height={400}
            className="h-48 w-full object-cover"
          />
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="block w-full rounded-xl border border-brand-brown/10 bg-white px-4 py-3 text-sm text-brand-brown file:mr-4 file:rounded-lg file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:font-bold file:text-white"
      />

      {isUploading ? (
        <p className="mt-2 text-sm font-medium text-brand-orange">
          Envoi de l&apos;image...
        </p>
      ) : null}

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
