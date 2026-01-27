import React, { useState } from "react";

export default function ImageUpload() {
  const [preview, setPreview] = useState(null);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="mb-6">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {preview && <img src={preview} alt="Preview" className="mt-4 max-h-64 mx-auto rounded shadow" />}
    </div>
  );
}
