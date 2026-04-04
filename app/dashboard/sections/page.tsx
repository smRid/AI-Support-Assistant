import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SectionsPage() {
  return (
    <div className="mx-auto max-w-7xl animate-in space-y-8 p-6 fade-in duration-500 md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Sections
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Define behavior and tone for different topics.
          </p>
        </div>

        <Button className="h-10 rounded-xl bg-white px-4 text-black hover:bg-zinc-200">
          <Plus className="mr-2 size-4" />
          Create Section
        </Button>
      </div>
    </div>
  );
}
