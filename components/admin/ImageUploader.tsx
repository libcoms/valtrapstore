"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of fileArray) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          toast.error(err.error ?? "Ошибка загрузки");
          continue;
        }

        const { url } = await res.json();
        uploaded.push(url);
      } catch {
        toast.error(`Не удалось загрузить ${file.name}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...value, ...uploaded]);
      toast.success(`Загружено ${uploaded.length} фото`);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const removeImage = (url: string) => {
    onChange(value.filter((u) => u !== url));
  };

  const moveImage = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div
        className="border-2 border-dashed border-stone-200 rounded-xl p-6 text-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-all"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm">Загружаю...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-stone-400">
            <Upload className="w-8 h-8" />
            <p className="text-sm font-medium">Перетащите фото или нажмите для выбора</p>
            <p className="text-xs">PNG, JPG, WEBP до 10 МБ · Можно несколько</p>
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {value.map((url, i) => (
            <div key={url} className="relative group aspect-square rounded-xl overflow-hidden bg-stone-100">
              <Image src={url} alt={`Фото ${i + 1}`} fill className="object-cover" sizes="120px" />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i - 1)}
                    className="w-6 h-6 rounded-full bg-white/90 text-stone-800 text-xs font-bold flex items-center justify-center hover:bg-white"
                    title="Переместить влево"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                  title="Удалить"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i < value.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(i, i + 1)}
                    className="w-6 h-6 rounded-full bg-white/90 text-stone-800 text-xs font-bold flex items-center justify-center hover:bg-white"
                    title="Переместить вправо"
                  >
                    →
                  </button>
                )}
              </div>

              {i === 0 && (
                <span className="absolute top-1 left-1 bg-amber-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full leading-none">
                  Гл.
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs text-stone-400">
          Первое фото — главное. Наведите на фото для управления.
        </p>
      )}
    </div>
  );
}
