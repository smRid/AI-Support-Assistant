import { getStatusBadge, getToneBadge } from "@/components/dashboard/sections/sectionBadges";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SectionTableProps {
  sections: Section[];
  isLoading: boolean;
  onPreview: (section: Section) => void;
  onCreateSection: () => void;
}

const SectionsTable = ({
  sections,
  isLoading,
  onPreview,
  onCreateSection,
}: SectionTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-white/5 hover:bg-transparent">
          <TableHead className="px-6 text-xs font-medium uppercase text-zinc-500">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-zinc-500">
            Sources
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-zinc-500">
            Tone
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-zinc-500">
            Scope
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-zinc-500">
            Status
          </TableHead>
          <TableHead className="pr-6 text-right text-xs font-medium uppercase text-zinc-500">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableCell colSpan={6} className="h-48 text-center">
              <div className="flex items-center justify-center gap-2 text-zinc-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                <span>Loading sections...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : sections.length > 0 ? (
          sections.map((section) => (
            <TableRow
              key={section.id}
              className="group border-white/5 transition-colors hover:bg-white/[0.02]"
            >
              <TableCell className="px-6 font-medium text-zinc-200">
                {section.name}
              </TableCell>
              <TableCell className="text-zinc-400">
                {section.sourceCount} {section.sourceCount === 1 ? "source" : "sources"}
              </TableCell>
              <TableCell>{getToneBadge(section.tone)}</TableCell>
              <TableCell className="text-zinc-400">
                {section.scopeLabel || "General"}
              </TableCell>
              <TableCell>{getStatusBadge(section.status)}</TableCell>
              <TableCell className="pr-6 text-right">
                <Button
                  variant="ghost"
                  className="h-8 px-3 text-zinc-300 hover:bg-white/[0.04] hover:text-white"
                  onClick={() => onPreview(section)}
                >
                  Preview
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableCell colSpan={6} className="h-48 text-center">
              <div className="flex flex-col items-center justify-center gap-3 px-6">
                <p className="text-sm text-zinc-400">No sections created yet.</p>
                <Button
                  onClick={onCreateSection}
                  className="h-10 rounded-xl bg-white px-4 text-black hover:bg-zinc-200"
                >
                  Create Section
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SectionsTable;
