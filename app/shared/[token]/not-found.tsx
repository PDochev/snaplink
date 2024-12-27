import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-red-500">Not Found</h2>
      <p>Could not find requested album</p>
      <Button variant="outline" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
}
