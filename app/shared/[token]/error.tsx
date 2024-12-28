"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error }: { error: Error }) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="scroll-m-20 text-3xl md:text-4xl font-extrabold tracking-tight lg:text-4xl mt-8 mb-8 text-red-500">
        An error occured
      </h1>
      <Button
        onClick={() => router.back()}
        className="text-slate-400"
        variant="link"
      >
        Back
      </Button>
      <Button className="text-slate-400" variant="link" asChild>
        <Link href="/">Home page</Link>
      </Button>
    </div>
  );
}
