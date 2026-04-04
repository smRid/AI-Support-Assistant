import { Button } from '@/components/ui/button';
import { FileText, Globe, Upload } from 'lucide-react';
import React from 'react'

const QuickActions = ({
  onOpenModal,
}: {
  onOpenModal: (tab: string) => void;
}) => {
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-3">
        <Button
            variant="outline"
            className="w-full min-h-[168px] py-10 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0A0A0E] hover:bg-white/20 hover:border-indigo-500/30 transition-all hover:text-white group whitespace-normal text-center"
            onClick={() => onOpenModal("website")}
        >
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                <Globe className="size-5 text-indigo-400" />
            </div>
            <div className="space-y-2 text-center w-full max-w-[300px] mx-auto">
                <span className="text-sm font-medium leading-5 block whitespace-normal">
                    Add Website
                </span>
                <p className="min-h-12 text-xs text-zinc-500 font-normal leading-6 whitespace-normal break-words line-clamp-2">
                    Crawl your website or specific pages to automatically keep your
                    knowledge base in sync.
                </p>
            </div>
        </Button>
        <Button
  variant="outline"
  className="w-full min-h-[168px] py-10 px-6 flex flex-col items-center justify-center gap-4 border-emerald-500/20 bg-[#0A0A0E] hover:bg-white/20 hover:border-emerald-500/30 transition-all hover:text-white group whitespace-normal text-center"
  onClick={() => onOpenModal("upload")}
>
  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
    <Upload className="size-5 text-emerald-400" />
  </div>
  <div className="space-y-2 text-center w-full max-w-[300px] mx-auto">
    <span className="text-sm font-medium leading-5 block whitespace-normal">
      Upload File
    </span>
    <p className="min-h-12 text-xs text-zinc-500 font-normal leading-6 whitespace-normal break-words line-clamp-2">
      Upload CSV files to instantly train your assistant with existing
      documents.
    </p>
  </div>
</Button>
<Button
  variant="outline"
  className="w-full min-h-[168px] py-10 px-6 flex flex-col items-center justify-center gap-4 border-white/5 bg-[#0A0A0E] hover:bg-white/20 hover:border-zinc-500/30 transition-all hover:text-white group whitespace-normal text-center"
  onClick={() => onOpenModal("text")}
>
  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-zinc-500/10 border border-zinc-500/20 group-hover:bg-zinc-500/20 transition-colors">
    <FileText className="size-5 text-zinc-300" />
  </div>
  <div className="space-y-2 text-center w-full max-w-[300px] mx-auto">
    <span className="text-sm font-medium leading-5 block whitespace-normal">
      Manual Text
    </span>
    <p className="min-h-12 text-xs text-zinc-500 font-normal leading-6 whitespace-normal break-words line-clamp-2">
      Manually copy-paste FAQs, internal notes, or policies directly into
      the editor for quick updates.
    </p>
  </div>
</Button>
</div>
  </div>;
};

export default QuickActions
