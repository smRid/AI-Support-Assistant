import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

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
            </CardContent>

          </Card>
          </Link>
        ))}
      </div>
      </section>
    </div>
  )
}

export default DashboardOverView