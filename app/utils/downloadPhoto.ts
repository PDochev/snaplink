export default function downloadPhoto(url: string) {
  // Extract filename from the URL, use a default if not possible
  const filename = url.split("/").pop() || "downloaded-image";

  // Fetch the image with CORS handling
  fetch(url, {
    headers: new Headers({
      Origin: window.location.origin,
    }),
    mode: "cors",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      // Create a blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("Download failed:", error);
      alert("Failed to download the image");
    });
}
