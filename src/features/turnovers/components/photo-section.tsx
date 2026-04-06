"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon, ZoomIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import type { TurnoverPhoto } from "@/types/database";

interface PhotoSectionProps {
  photos: TurnoverPhoto[];
  turnoverID: string;
  companyId: string;
}

export function PhotoSection({ photos: initialPhotos, turnoverID, companyId }: PhotoSectionProps) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [viewingPhoto, setViewingPhoto] = useState<TurnoverPhoto | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("turnover-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast({ variant: "destructive", title: "Invalid file", description: "Please upload image files only." });
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({ variant: "destructive", title: "File too large", description: "Images must be under 10MB." });
        continue;
      }

      const fileName = `${companyId}/${turnoverID}/${Date.now()}-${file.name.replace(/\s/g, "_")}`;

      const { error: uploadError } = await supabase.storage
        .from("turnover-photos")
        .upload(fileName, file, { upsert: false });

      if (uploadError) {
        toast({ variant: "destructive", title: "Upload failed", description: uploadError.message });
        continue;
      }

      const { data: photoRecord, error: dbError } = await supabase
        .from("turnover_photos")
        .insert({
          company_id: companyId,
          turnover_id: turnoverID,
          image_path: fileName,
          caption: caption || null,
        })
        .select()
        .single();

      if (dbError) {
        toast({ variant: "destructive", title: "Error saving photo", description: dbError.message });
      } else {
        setPhotos((prev) => [photoRecord, ...prev]);
        toast({ variant: "success", title: "Photo uploaded" });
      }
    }

    setCaption("");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (photo: TurnoverPhoto) => {
    const { error: storageError } = await supabase.storage
      .from("turnover-photos")
      .remove([photo.image_path]);

    if (storageError) {
      toast({ variant: "destructive", title: "Delete failed", description: storageError.message });
      return;
    }

    await supabase.from("turnover_photos").delete().eq("id", photo.id);
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    toast({ variant: "success", title: "Photo deleted" });
  };

  return (
    <div>
      {/* Upload area */}
      <div className="mb-4 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Caption (optional)"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4" /> Upload Photos</>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </div>

      {/* Photo grid */}
      {photos.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border py-10 cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground/40 mb-2" />
          <p className="text-sm text-muted-foreground">No photos yet — click to upload</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted"
            >
              <Image
                src={getPublicUrl(photo.image_path)}
                alt={photo.caption || "Turnover photo"}
                fill
                className="object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-white/20 mr-1"
                  onClick={() => setViewingPhoto(photo)}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-white hover:bg-red-500/80"
                  onClick={() => handleDelete(photo)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {photo.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                  <p className="text-xs text-white truncate">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}

          {/* Add more */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-primary"
          >
            <Upload className="h-5 w-5 mb-1" />
            <span className="text-xs">Add more</span>
          </button>
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={!!viewingPhoto} onOpenChange={() => setViewingPhoto(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black border-0">
          {viewingPhoto && (
            <div className="relative w-full aspect-video">
              <Image
                src={getPublicUrl(viewingPhoto.image_path)}
                alt={viewingPhoto.caption || "Photo"}
                fill
                className="object-contain"
              />
            </div>
          )}
          {viewingPhoto?.caption && (
            <p className="text-sm text-white/80 text-center py-2">{viewingPhoto.caption}</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
