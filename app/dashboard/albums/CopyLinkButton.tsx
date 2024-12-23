"use client";

import { useState } from "react";

export default function CopyLinkButton({ shareToken }: { shareToken: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const shareUrl = `${window.location.origin}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-sm text-green-400/60 hover:text-green-400/100"
    >
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
