"use client";
import { ChangeEvent } from "react";

export default function FileUpload() {
  const uploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | null | undefined = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const fileData = event.target?.result;
      if (fileData) {
        const presignedURL = new URL("/api/presigned", window.location.href);
        presignedURL.searchParams.set("fileName", file.name);
        presignedURL.searchParams.set("contentType", file.type);
        fetch(presignedURL.toString())
          .then((res) => res.json())
          .then((res) => {
            const body = new Blob([fileData], { type: file.type });
            fetch(res.signedUrl, {
              body,
              method: "PUT",
            }).then(() => {
              fetch("/api/user/image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  objectUrl: res.signedUrl.split("?")[0],
                }),
              });
            });
          });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <input onChange={uploadFile} type="file" name="file" />
      {/* <input type="submit" value="Upload" /> */}
    </div>
  );
}
