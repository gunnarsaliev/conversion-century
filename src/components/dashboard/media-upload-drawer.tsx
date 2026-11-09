"use client";

import { ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import { uploadMedia } from "@/app/[locale]/(frontend)/dashboard/media/actions";
import { bannerPrimaryActionClassName } from "@/components/dashboard/page-header-banner";
import { drawerFooterActionClassName, drawerFooterClassName } from "@/components/dashboard/drawer-footer-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MEDIA_UPLOAD_MAX_BYTES } from "@/lib/media-upload";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Media upload drawer — "Add new" on Dashboard → Media
// ---------------------------------------------------------------------------
//
// Drop or pick images, optionally give each alt text, then upload. Files are
// sent one per request (see uploadMedia), so each may be up to 4 MB.

type PendingFile = {
  id: string;
  file: File;
  previewUrl: string;
  alt: string;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
};

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const MediaUploadDrawer = () => {
  const t = useTranslations("Media.upload");
  const router = useRouter();
  const inputId = React.useId();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState<PendingFile[]>([]);
  const [rejected, setRejected] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  // Free preview object URLs when files leave the list or the drawer unmounts.
  const filesRef = React.useRef(files);
  React.useEffect(() => {
    filesRef.current = files;
  }, [files]);
  React.useEffect(
    () => () => filesRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl)),
    [],
  );

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const accepted: PendingFile[] = [];
    const skipped: string[] = [];
    for (const file of Array.from(list)) {
      if (!file.type.startsWith("image/")) {
        skipped.push(t("errors.type", { name: file.name }));
      } else if (file.size > MEDIA_UPLOAD_MAX_BYTES) {
        skipped.push(t("errors.size", { name: file.name }));
      } else {
        accepted.push({
          id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          alt: "",
          status: "pending",
        });
      }
    }
    setRejected(skipped);
    setFiles((current) => [...current, ...accepted]);
  };

  const removeFile = (id: string) => {
    setFiles((current) => {
      const item = current.find((entry) => entry.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return current.filter((entry) => entry.id !== id);
    });
  };

  const reset = () => {
    files.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setFiles([]);
    setRejected([]);
  };

  const update = (id: string, patch: Partial<PendingFile>) =>
    setFiles((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const handleUpload = async () => {
    const queue = files.filter((item) => item.status !== "done");
    if (queue.length === 0) return;
    setIsUploading(true);

    let uploaded = 0;
    for (const item of queue) {
      update(item.id, { status: "uploading", error: undefined });
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("alt", item.alt);
      const result = await uploadMedia(formData);
      if (result.success) {
        uploaded += 1;
        update(item.id, { status: "done" });
      } else {
        update(item.id, { status: "error", error: result.error });
      }
    }

    setIsUploading(false);
    if (uploaded > 0) {
      toast.success(t("uploaded", { count: uploaded }));
      router.refresh();
    }
    // Everything went up: close. Otherwise keep the failed ones on screen.
    if (uploaded === queue.length) {
      setOpen(false);
      reset();
    }
  };

  const pendingCount = files.filter((item) => item.status !== "done").length;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (isUploading) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <SheetTrigger
        render={
          <button type="button" className={bannerPrimaryActionClassName}>
            <Plus className="size-4" aria-hidden="true" />
            {t("addNew")}
          </button>
        }
      />
      <SheetContent showCloseButton={false} aria-describedby={undefined}>
        <SheetHeader className="flex-row items-center justify-between border-b">
          <SheetTitle className="text-lg">{t("title")}</SheetTitle>
          <SheetClose
            disabled={isUploading}
            render={<Button size="icon" variant="secondary" aria-label={t("close")} />}
          >
            <X />
          </SheetClose>
        </SheetHeader>

        <div className="no-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-auto p-5">
          {/* Drop zone: also a label for the hidden file input, so clicking
              or pressing Enter/Space on it opens the file picker. */}
          <label
            htmlFor={inputId}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
              "hover:border-(--action) hover:bg-(--action)/5 focus-within:border-(--action) focus-within:ring-3 focus-within:ring-(--action)/30",
              isDragging && "border-(--action) bg-(--action)/5",
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-muted">
              <ImagePlus className="size-5 text-muted-foreground" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">{t("dropTitle")}</span>
            <span className="text-xs text-muted-foreground">{t("dropHint")}</span>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              multiple
              disabled={isUploading}
              className="sr-only"
              onChange={(event) => {
                addFiles(event.target.files);
                // Let the same file be picked again after removing it.
                event.target.value = "";
              }}
            />
          </label>

          {rejected.length > 0 ? (
            <ul className="space-y-1 text-sm text-destructive" role="alert">
              {rejected.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}

          {files.length > 0 ? (
            <ul className="flex flex-col gap-3" aria-label={t("selected")}>
              {files.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-lg border p-2.5">
                  {/* Local blob preview; next/image can't optimise blob: URLs. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt=""
                    className="size-16 shrink-0 rounded-md bg-muted object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{item.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatSize(item.file.size)}
                          {item.status === "uploading" ? ` · ${t("uploading")}` : null}
                          {item.status === "done" ? ` · ${t("done")}` : null}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        disabled={isUploading}
                        aria-label={t("remove", { name: item.file.name })}
                        onClick={() => removeFile(item.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <Input
                      value={item.alt}
                      disabled={isUploading || item.status === "done"}
                      onChange={(event) => update(item.id, { alt: event.target.value })}
                      placeholder={t("altPlaceholder")}
                      aria-label={t("altLabel", { name: item.file.name })}
                      className="h-8"
                    />
                    {item.error ? (
                      <p className="text-xs text-destructive">{item.error}</p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <SheetFooter className={drawerFooterClassName}>
          <Button
            size="lg"
            className={drawerFooterActionClassName}
            type="button"
            onClick={handleUpload}
            disabled={pendingCount === 0}
            loading={isUploading}
            loadingText={t("uploading")}
          >
            <Upload aria-hidden="true" />
            {pendingCount > 0 ? t("uploadCount", { count: pendingCount }) : t("upload")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export { MediaUploadDrawer };
