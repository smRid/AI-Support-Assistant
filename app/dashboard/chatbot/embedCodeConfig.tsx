import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code } from 'lucide-react';
import React, { useState } from 'react'

const EmbedCodeConfig = ({chatbotId}:{chatbotId:string | undefined}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
  setCopied(true);
  navigator.clipboard.writeText(`<script src="https://oneminutestack.com/widget.js" data-id="${chatbotId}" defer></script>`);
  setTimeout(() => setCopied(false), 2000);
};

  return (
  <Card className="border-white/5 bg-[#0A0A0E]">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <Code className="w-4 h-4 text-zinc-500" />
        <CardTitle className="text-sm font-medium text-white uppercase tracking-wider">
          Embed Code
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="relative group">
        <div className="bg-[#050509] border border-white/10 rounded-lg p-3 overflow-hidden">
          <code className="text-[10px] text-zinc-400 font-mono block overflow-x-auto">
            {`<script src="https://oneminutestack.com/widget.js" \n  data-id="${
           chatbotId || "..."
           }" \n  defer>\n</script>`}
          </code>
        </div>
      </div>
    </CardContent>
  </Card>
);
}

export default EmbedCodeConfig