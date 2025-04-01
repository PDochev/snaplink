export default async function downloadPhoto(url: string) {
  // Extract filename from the URL, use a default if not possible
  const filename = url.split("/").pop() || "";

  try {
    const response = await fetch(url, {
      headers: new Headers({
        Origin: window.location.origin,
      }),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // A Blob (Binary Large Object) represents raw binary data with a specified MIME type
    // In this case, the Blob contains the image data in its original format (PNG, JPEG, etc.)

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    alert("Failed to download the image");
  }
}
