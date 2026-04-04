import { Badge } from "@/components/ui/badge";

export function getToneBadge(tone: Tone) {
  switch (tone) {
    case "strict":
      return (
        <Badge className="border border-red-500/30 bg-red-500/5 text-red-500" variant="outline">
          Strict
        </Badge>
      );
    case "neutral":
      return (
        <Badge className="border border-blue-500/30 bg-blue-500/5 text-blue-500" variant="outline">
          Neutral
        </Badge>
      );
    case "friendly":
      return (
        <Badge className="border border-indigo-500/30 bg-indigo-500/5 text-indigo-500" variant="outline">
          Friendly
        </Badge>
      );
    case "empathetic":
      return (
        <Badge className="border border-purple-500/30 bg-purple-500/5 text-purple-500" variant="outline">
          Empathetic
        </Badge>
      );
    default:
      return null;
  }
}

export function getStatusBadge(status: SectionStatus) {
  switch (status) {
    case "active":
      return (
        <Badge className="border border-emerald-500/30 bg-emerald-500/5 text-emerald-400" variant="outline">
          Active
        </Badge>
      );
    case "draft":
      return (
        <Badge className="border border-amber-500/30 bg-amber-500/5 text-amber-400" variant="outline">
          Draft
        </Badge>
      );
    case "disabled":
      return (
        <Badge className="border border-zinc-500/30 bg-zinc-500/5 text-zinc-400" variant="outline">
          Disabled
        </Badge>
      );
    default:
      return null;
  }
}
