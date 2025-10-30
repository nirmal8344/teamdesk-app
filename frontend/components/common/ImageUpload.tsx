import React, { useState } from 'react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, currentImage }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageSelect(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1">Profile Picture</label>
      <div className="mt-1 flex items-center space-x-4">
        <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-muted">
          {preview ? (
            <img src={preview} alt="Avatar preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-full w-full text-muted-foreground/50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.993A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </span>
        <label htmlFor="avatar-upload" className="cursor-pointer bg-card border border-input py-2 px-3 text-sm font-medium rounded-xl hover:bg-accent">
          <span>Upload</span>
          <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;