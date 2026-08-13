"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Loader2, Star, UploadCloud, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  COMPETITION_IMAGES_BUCKET,
  storagePathFromPublicUrl,
} from "@/lib/supabase/storage";
import { cn } from "@/lib/utils";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

async function uploadOne(file: File, folder: string) {
  const supabase = createClient();
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(COMPETITION_IMAGES_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(COMPETITION_IMAGES_BUCKET).getPublicUrl(path);

  return publicUrl;
}

/**
 * Drag-and-drop multi-image uploader for the admin competition form.
 * Uploads directly to Supabase Storage from the browser (RLS restricts
 * writes to admins — see 20260815000001_competition_images_storage.sql).
 * The first image in `images` is the competition's title/cover image.
 */
export function ImageDropzone({
  images,
  onChange,
  folder,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  folder: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const draggedIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList);
    const invalid = files.find(
      (f) => !f.type.startsWith("image/") || f.size > MAX_FILE_BYTES,
    );
    if (invalid) {
      setError(
        "Only image files under 8MB are allowed — check your selection.",
      );
      return;
    }

    setUploading((n) => n + files.length);
    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadOne(file, folder)),
      );
      onChange([...images, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading((n) => n - files.length);
    }
  }

  async function removeAt(index: number) {
    const url = images[index];
    onChange(images.filter((_, i) => i !== index));

    const path = storagePathFromPublicUrl(url);
    if (path) {
      const supabase = createClient();
      await supabase.storage
        .from(COMPETITION_IMAGES_BUCKET)
        .remove([path])
        .catch(() => {
          // Best-effort: the image is already unlinked from the form either way.
        });
    }
  }

  function makeTitleImage(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    onChange(next);
  }

  function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...images];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-6 py-10 text-center transition-colors",
          dragActive && "border-primary bg-primary/5",
        )}
      >
        <UploadCloud className="size-7 text-muted-foreground" />
        <p className="text-sm font-medium">
          Drag & drop images here, or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          PNG or JPG, up to 8MB each. Upload multiple at once — the first
          image is used as the title image.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploading > 0 && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Uploading {uploading} image{uploading > 1 ? "s" : ""}…
        </p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => (draggedIndex.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedIndex.current !== null) {
                  reorder(draggedIndex.current, index);
                }
                draggedIndex.current = null;
              }}
              className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
            >
              <Image
                src={url}
                alt=""
                fill
                unoptimized
                className="object-cover"
              />

              <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/60 p-1 text-white/80">
                <GripVertical className="size-3" />
              </span>

              {index === 0 ? (
                <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  <Star className="size-2.5 fill-current" />
                  Title image
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeTitleImage(index)}
                  className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Set as title
                </button>
              )}

              <button
                type="button"
                aria-label="Remove image"
                onClick={() => removeAt(index)}
                className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-destructive"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Submitted with the form — order matters, first = title image. */}
      {images.map((url) => (
        <input key={url} type="hidden" name="images" value={url} />
      ))}
    </div>
  );
}
