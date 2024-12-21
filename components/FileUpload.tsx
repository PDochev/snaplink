"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { uploadImage } from "@/app/lib/actions";
import { Loader2 } from "lucide-react";

export default function FileUpload({ userId }: { userId: number }) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Allowed image MIME types
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  // Allowed file size in MB
  const MAX_FILE_SIZE_MB = 10;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setSelectedFile(null);
        setError(
          `File size must be less than ${MAX_FILE_SIZE_MB} MB. Your file is ${(
            file.size /
            (1024 * 1024)
          ).toFixed(2)} MB.`
        );
        return;
      }

      if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setSelectedFile(file);
        setError(null);
      } else {
        setSelectedFile(null);
        setError("Please upload only image files (JPEG, PNG, GIF, WEBP, SVG).");
      }
    } else {
      setSelectedFile(null);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true); // Indicate upload has started
    setError(null); // Clear any previous error

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        const presignedURL = new URL("/api/presigned", window.location.href);
        presignedURL.searchParams.set("fileName", selectedFile.name);
        presignedURL.searchParams.set("contentType", selectedFile.type);

        try {
          const response = await fetch(presignedURL.toString());
          const { signedUrl } = await response.json();

          // Upload to S3
          const S3Response = await fetch(signedUrl, {
            body: new Blob([fileData], { type: selectedFile.type }),
            method: "PUT",
          });

          if (!S3Response.ok) {
            throw new Error("Upload failed");
          }

          // Call server action to save image
          await uploadImage(signedUrl.split("?")[0], userId);
        } catch (error) {
          console.error("Upload failed", error);
          setError("Failed to upload image");
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-4 mb-12 mx-auto">
      <div className="flex flex-col gap-2 items-center ">
        <div className="flex gap-4 items-center">
          <Input
            className="w-48 sm:w-full"
            onChange={handleFileChange}
            type="file"
            name="file"
            accept="image/*"
            disabled={isUploading}
          />
          <Button onClick={uploadFile} disabled={isUploading || !selectedFile}>
            {isUploading ? (
              <>
                <Loader2 className="animate-spin" /> Please Wait
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
}
