import { useEffect, useRef } from "react";
import { X, UploadCloud } from "lucide-react";

export default function UploadImage({ addBtn, onUpload, image, setImage }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImage(result);
      onUpload(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (addBtn) {
        setImage(null);
    }
  }, [addBtn, setImage]);
  
  return (
    <div className="flex-shrink-0">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div
        className="w-40 h-40 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground bg-input/50 cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileInputRef.current.click()}
      >
        {image ? (
          <div className="relative w-full h-full">
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:bg-red-700"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="text-center p-2">
            <UploadCloud className="mx-auto mb-2" size={32} />
            <p className="text-sm">Upload Image</p>
          </div>
        )}
      </div>
    </div>
  );
}
