import React, { useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useImageUpload } from "@/store/useImageUpload";

export function ImageUpload({ onUploadSuccess, defaultImage, label = "Upload Image", folder = "general" }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(defaultImage || "");
  const { uploadImage } = useImageUpload();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", folder);

    setLoading(true);
    try {
      const res = await uploadImage(formData);

      if (res.status === "success") {
        toast.success("Image uploaded successfully");
        onUploadSuccess(res.url);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
      setPreview(defaultImage || "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-full">
      <label className="text-sm font-medium text-slate-700">{label}</label>

      <div className="relative group overflow-hidden rounded-xl border-2 border-dashed border-slate-200 hover:border-red/50 transition-colors aspect-video flex items-center justify-center bg-slate-50 max-h-50">
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => { 
                  e.preventDefault(); 
                  document.getElementById("file-upload").click(); }}
                disabled={loading}
              >
                Change
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => { 
                  e.preventDefault(); 
                  setPreview(""); 
                  onUploadSuccess(""); }}
                disabled={loading}
              >
                Remove
              </Button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => document.getElementById("file-upload").click()}
            className="flex flex-col items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors"
            disabled={loading}
          >
            <Upload size={32} />
            <span className="text-xs font-medium uppercase tracking-wider">Select Image</span>
          </button>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10">
            <Loader2 className="animate-spin text-red" size={32} />
            <p className="text-xs font-bold text-red uppercase tracking-widest">Uploading...</p>
          </div>
        )}
      </div>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <p className="text-[10px] text-slate-400">Max size: 5MB. Formats: JPG, PNG, WEBP</p>
    </div>
  );
}
