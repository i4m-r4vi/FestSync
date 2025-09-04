import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react"; // ❌ icon from lucide-react (or you can use any svg)

export default function UploadImage({ addBtn,onUpload }) {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      onUpload(reader.result); // ✅ base64 string
    };
    reader.readAsDataURL(file); // convert to base64
  };

  const handleRemoveImage = () => {
    setImage(null);
    onUpload(null); // clear in parent also
    fileInputRef.current.value = ""; // reset input
  };

  useEffect(()=>{
    setImage(null)
  },[addBtn])

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {image && (
        <div className="relative inline-block">
          <img
            src={image}
            alt="Uploaded"
            className="w-40 h-40 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current.click()}
        className="px-4 py-2 mt-2 bg-amber-600 text-white rounded-lg block"
      >
        Upload Image
      </button>
    </div>
  );
}
