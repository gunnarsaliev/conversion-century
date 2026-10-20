"use client";

import { Download, Loader2 } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Downloads an offer PDF from its route. The PDF is rendered on request and
// takes a few seconds, so the button is disabled and shows a spinner until
// the file arrives (a plain download link gives no feedback meanwhile).

// The server's file name, from `Content-Disposition: attachment; filename="…"`.
const fileName = (response: Response, fallback: string) =>
  response.headers.get("content-disposition")?.match(/filename="?([^";]+)"?/)?.[1] ?? fallback;

function PdfDownloadButton({
  href,
  children = "Изтегли офертата (PDF)",
  className,
}: {
  href: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const download = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(href);
      if (!response.ok) throw new Error(`PDF request failed: ${response.status}`);
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName(response, "oferta.pdf");
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        onClick={download}
        disabled={loading}
        aria-busy={loading}
        className={cn("w-full text-white", className)}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        {loading ? "Генериране на PDF…" : children}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          PDF файлът не можа да бъде генериран. Опитайте отново.
        </p>
      )}
    </div>
  );
}

export { PdfDownloadButton };
