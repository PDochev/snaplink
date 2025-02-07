"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound({ error }: { error: Error }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-red-500">Not Found</h2>
      <p>Could not find requested album</p>
      <Button
        onClick={() => router.back()}
        className="text-slate-400"
        variant="link"
      >
        Back
      </Button>
      <Button variant="outline" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
