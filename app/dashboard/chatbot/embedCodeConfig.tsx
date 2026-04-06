import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Check, Code, Copy } from 'lucide-react';
import React, { useState } from 'react'

const EmbedCodeConfig = ({chatbotId}:{chatbotId:string | undefined}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
  setCopied(true);
  navigator.clipboard.writeText(`<script src="http://localhost:3000/widget.js" data-id="${chatbotId}" defer></script>`);
  setTimeout(() => setCopied(false), 2000);
};

  return (
  <Card className="rounded-2xl border border-white/5 bg-[#0A0A0E] py-5">
    <CardHeader className="px-6 pb-4">
      <div className="flex items-center gap-2.5">
        <Code className="h-4 w-4 text-zinc-500" />
        <CardTitle className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-200">
          Embed Code
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 px-6">
      <div className="relative group">
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#06060A] px-5 py-4">
          <pre className="overflow-x-auto whitespace-pre-wrap break-all">
            <code className="block font-mono text-xs leading-6 text-zinc-400">
              {`<script src="http://localhost:3000/widget.js" \n data-id="${chatbotId || "..."}"\n  defer>\n</script>`}
            </code>
          </pre>
        </div>
        <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 h-6 w-6 bg-white/10 hover:bg-white/20 text-white border-none"
            onClick={handleCopyCode}
        >
            {copied ? (
                <Check className="w-3 h-3" />
            ) : (
                <Copy className="w-3 h-3" />
            )}
            </Button>
      </div>
      <div className="flex items-start gap-2 text-xs text-amber-500/80 bg-amber-500/5 p-2 rounded-md border border-amber-500/10">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
            Paste this code before the closing &lt;/head&gt; tag on your
            website.
        </span>
      </div>
    </CardContent>
  </Card>
);
}

export default EmbedCodeConfig
