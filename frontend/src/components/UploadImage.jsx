// src/components/UploadImage.js
import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export default function UploadImage({ onUpload }) {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file); // 👈 match the field name your backend expects

    try {
      const res = await axiosInstance.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.url; // backend should return { url: "cloudinary_url" }
      setPreview(imageUrl);
      onUpload(imageUrl); // send URL back to parent form
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
        {loading ? "Uploading..." : "Choose Image"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </label>
      {preview && (
        <img
          src={preview}
          alt="Uploaded Preview"
          className="w-40 h-40 object-cover rounded-lg shadow"
        />
      )}
    </div>
  );
}
