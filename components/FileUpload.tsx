"use client";

import { useState } from "react";
import { uploadImage } from "@/app/lib/actions";

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        const presignedURL = new URL("/api/presigned", window.location.href);
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);

        try {
          const res = await fetch(presignedURL.toString());
          const { signedUrl } = await res.json();

          // Upload to S3
          const uploadResponse = await fetch(signedUrl, {
            body: new Blob([fileData], { type: file.type }),
            method: "PUT",
          });

          // Call server action to save image
          await uploadImage(signedUrl.split("?")[0]);
        } catch (error) {
          console.error("Upload failed", error);
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="mb-6">
      <input
        onChange={uploadFile}
        type="file"
        name="file"
        disabled={isUploading}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}
