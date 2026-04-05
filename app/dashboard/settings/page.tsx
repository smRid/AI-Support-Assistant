"use client"

import TeamSection from '@/components/dashboard/settings/teamSection';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'

interface OrganizationData {
  id: string;
  business_name: string;
  website_url: string;
  created_at: string;
}

const getDeleteWorkspaceErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();

    if (payload && typeof payload.error === "string") {
      return payload.error;
    }
  } catch {
    // Ignore JSON parse failures and use the fallback message.
  }

  return "Failed to delete workspace data.";
};

const Settingspage = () => {

    const [organizationData, setOrganizationData] = useState<OrganizationData>()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [isDeletingWorkspace, setIsDeletingWorkspace] = useState(false);
    const [deleteWorkspaceError, setDeleteWorkspaceError] = useState("");

    useEffect(() => {
  const fetchOrganizationData = async () => {
    const response = await fetch("/api/organization/fetch");
    const data = await response.json();
    setOrganizationData(data.organization);
   };
   fetchOrganizationData();
}, []);

  const handleDeleteWorkspace = async () => {
    try {
      setIsDeletingWorkspace(true);
      setDeleteWorkspaceError("");

      const response = await fetch("/api/workspace/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(await getDeleteWorkspaceErrorMessage(response));
      }

      setOpenDeleteDialog(false);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Failed to delete workspace:", error);
      setDeleteWorkspaceError(
        error instanceof Error
          ? error.message
          : "Failed to delete workspace data.",
      );
    } finally {
      setIsDeletingWorkspace(false);
    }
  };


  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
  <div>
    <h1 className="text-2xl font-semibold text-white tracking-tight">
      Settings
    </h1>
    <p className="text-sm text-zinc-400 mt-1">
      Manage workspace preferences, security, and billing.
    </p>
  </div>

  <Card className="border-white/5 bg-[#0A0A0E]">
  <CardHeader>
    <CardTitle className="text-base font-medium text-white">
      Workspace Settings
    </CardTitle>
    <CardDescription>
      General settings for your organization. (Read Only)
    </CardDescription>
  </CardHeader>
  <CardContent className="space-y-6">
  <div className="grid gap-4 md:grid-cols-2">
    <div className="space-y-2">
      <Label className="text-zinc-500">Workspace Name</Label>
      <div className="p-3 rounded-md bg-white/5 border border-white/5 text-white">
        {organizationData?.business_name}
      </div>
    </div>
    <div className="space-y-2">
      <Label className="text-zinc-500">Primary Website</Label>
      <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
        {organizationData?.website_url}
      </div>
    </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2 text-white">
        <Label className="text-zinc-500">Default Language</Label>
        <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
        English
      </div>
      </div>
      <div className="space-y-2 text-white">
        <Label className="text-zinc-500">Timezone</Label>
        <div className="p-3 rounded-md bg-white/5 border border-white/5 text-zinc-300 text-sm">
        UTC (GMT+6)
      </div>
      </div>
    </div>
</CardContent>
</Card>

    <TeamSection />

    <Card className="border-red-500/10 bg-red-500/[0.03]">
      <CardHeader>
        <CardTitle className="text-base font-medium text-red-400">
          Danger Zone
        </CardTitle>
        <CardDescription className="text-red-500/70">
          Irreversible actions for this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 border-t border-red-500/10 pt-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-medium text-white">Delete Workspace</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Permanently delete all knowledge, conversations, and settings.
          </p>
        </div>

        <AlertDialog
          open={openDeleteDialog}
          onOpenChange={(open) => {
            if (isDeletingWorkspace) {
              return;
            }

            setOpenDeleteDialog(open);

            if (!open) {
              setDeleteWorkspaceError("");
            }
          }}
        >
          <AlertDialogTrigger
            render={
              <Button
                variant="destructive"
                size="sm"
                className="border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
              />
            }
          >
            <Trash2 className="mr-2 size-4" />
            Delete
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-[calc(100%-2rem)] border-white/10 bg-[#121216] text-white sm:max-w-[560px]">
            <AlertDialogHeader className="place-items-start text-left">
              <AlertDialogTitle className="text-2xl font-semibold text-white">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base leading-7 text-zinc-400">
                This action cannot be undone. This will permanently delete your
                workspace and remove all associated data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {deleteWorkspaceError ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {deleteWorkspaceError}
              </div>
            ) : null}

            <AlertDialogFooter className="border-white/10 bg-white/[0.02] sm:justify-end">
              <AlertDialogCancel
                variant="outline"
                disabled={isDeletingWorkspace}
                className="border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void handleDeleteWorkspace()}
                disabled={isDeletingWorkspace}
                className="bg-[#ff3b3b] text-white hover:bg-[#ff5252]"
              >
                {isDeletingWorkspace ? "Deleting..." : "Delete Workspace"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
</div>
  )
}

export default Settingspage
