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
      <h1 className="scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl mt-8 mb-8 text-red-500">
        404
      </h1>
      <p>This page could not be found</p>
      <Button
        onClick={() => router.back()}
        className="text-slate-400"
        variant="link"
      >
        Back
      </Button>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
