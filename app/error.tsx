"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl text-red-500">Error fetching photo</div>
      <button
        onClick={() => router.back()}
        className="text-lg text-blue-500 ml-2"
      >
        Back
      </button>
      <Link href="/">Home page</Link>
    </div>
  );
}
