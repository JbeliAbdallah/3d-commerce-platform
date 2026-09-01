"use client";

import { useTransition } from "react";

type ArchiveProductButtonProps = {
  productId: string;
  action: (productId: string) => Promise<void>;
};

export default function ArchiveProductButton({
  productId,
  action,
}: ArchiveProductButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleArchive() {
    const confirmed = window.confirm(
      "Voulez-vous vraiment archiver ce produit ?",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      await action(productId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={isPending}
      className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Archivage..." : "Archiver"}
    </button>
  );
}
