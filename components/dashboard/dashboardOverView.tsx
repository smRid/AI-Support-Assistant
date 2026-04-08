import { ArrowUpRight, Check, FileText, Globe, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const DashboardOverView = () => {
  const [data, setData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
  setOrigin(window.location.origin);

  fetch("/api/overview")
    .then((res) => res.json())
    .then((d) => {
      setData(d);
      setIsLoading(false);
    }).catch((error) => {
      console.log(error);
      setIsLoading(false);
    });
}, []);

const handleCopy = () => {};

if (isLoading) {
  return (
    <div className="p-8 flex items-center justify-center text-zinc-500">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}

if (!data) return null;

const { knowledge, sections, chats, counts } = data;

const setupSteps = [
  { label: "Website Scanned", complete: true, href: "#" },
  {
    label: "Knowledge Added",
    complete: counts.knowledge > 0,
    href: "/dashboard/knowledge",
  },
  {
    label: "Sections Configured",
    complete: counts.sections > 0,
    href: "/dashboard/sections",
  },
  {
    label: "Widget Installed",
    complete: counts.conversations > 0,
    href: "#widget",
  },
];



  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <section className="space-y-4">
        <h3 className="text-lg font-medium text-white">Setup Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {setupSteps.map((step, i) => (
          <Link key={i} href={step.href} className='block group'>
            <Card
            className={cn(
              "border-white/5 bg-white/2 hover:bg-white/4 transition-colors",
              step.complete
                ? "opacity-60"
                : "border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10"
            )}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <span className={cn("text-sm font-medium", step.complete ? "text-zinc-500" : "text-white")}>
              {step.label}
            </span>
            {step.complete ? (
              <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </CardContent>

          </Card>
          </Link>
        ))}
      </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/5 bg-[#0A0A0E]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-medium text-white">
                Knowledge Base
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs border-white/10 bg-transparent text-zinc-400 hover:text-white hover:bg-white/12"
                asChild
              >
                <Link href="/dashboard/knowledge">Manage sources</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-zinc-500 font-medium">
                    Pages
                  </span>
                </div>
                <span className="text-2xl font-semibold text-white">
                  {knowledge.website || 0}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-zinc-500 font-medium">
                    Manual Text
                  </span>
                </div>
                <span className="text-2xl font-semibold text-white">
                  {knowledge.text || 0}
                </span>
              </div>

               <div className="p-3 rounded-lg bg-white/2 border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-zinc-500 font-medium">
                    Uploads
                  </span>
                </div>
                <span className="text-2xl font-semibold text-white">
                  {knowledge.upload || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverView