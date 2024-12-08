"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { uploadImage } from "@/app/lib/actions";
import { Loader2 } from "lucide-react";

export default function FileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    setSelectedFile(file || null);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        const presignedURL = new URL("/api/presigned", window.location.href);
        presignedURL.searchParams.set("fileName", selectedFile.name);
        presignedURL.searchParams.set("contentType", selectedFile.type);

        try {
          const res = await fetch(presignedURL.toString());
          const { signedUrl } = await res.json();

          // Upload to S3
          const uploadResponse = await fetch(signedUrl, {
            body: new Blob([fileData], { type: selectedFile.type }),
            method: "PUT",
          });

          if (!uploadResponse.ok) {
            throw new Error("Upload failed");
          }

          // Call server action to save image
          await uploadImage(signedUrl.split("?")[0]);
        } catch (error) {
          console.error("Upload failed", error);
        } finally {
          setIsUploading(false);
        }
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div className="flex flex-col justify-center items-center mt-4 mb-6 mx-auto">
      <div className="flex gap-4 items-center">
        <Input
          onChange={handleFileChange}
          type="file"
          name="file"
          disabled={isUploading}
        />
        <Button onClick={uploadFile} disabled={isUploading || !selectedFile}>
          {isUploading ? (
            <>
              {" "}
              <Loader2 className="animate-spin" /> Please Wait
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </div>
  );
}
