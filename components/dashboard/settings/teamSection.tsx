"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  user_email: string;
  image?: string;
  role?: string;
  status?: string;
}

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    fetchTeam();
  }, []);

const fetchTeam = async () => {
  try {
    const res = await fetch("/api/team/fetch");
    if (res.ok) {
      const data = await res.json();
      setTeam(data.team);
      setInviteError("");
      return;
    }

    const data = await res.json().catch(() => null);
    setInviteError(
      typeof data?.error === "string"
        ? data.error
        : "Failed to load team members.",
    );
  } catch (error) {
    console.log(error, "Team member fetching error");
    setInviteError("Failed to load team members.");
  } finally {
    setIsLoading(false);
  }
};

const handleAddMember = async () => {
  if (!newMemberEmail) return;

  setIsAdding(true);
  setInviteError("");
  setInviteSuccess("");

  try {
    const res = await fetch("/api/team/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newMemberEmail, name: newMemberName })
    });

    if (res.ok) {
      setNewMemberEmail("");
      setNewMemberName("");
      setOpenDialog(false);
      setInviteSuccess("Invitation sent successfully.");
      await fetchTeam();
      return;
    }

    const data = await res.json().catch(() => null);
    setInviteError(
      typeof data?.error === "string"
        ? data.error
        : "Failed to send invitation.",
    );
  } catch (error) {
    console.log(error, "Team member adding error");
    setInviteError("Failed to send invitation.");
  } finally {
    setIsAdding(false);
  }
};

const getInitials = (name: string, email: string) => {
  const trimmedName = name.trim();

  if (trimmedName) {
    const initials = trimmedName
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

    if (initials) {
      return initials;
    }
  }

  return email.slice(0, 2).toUpperCase();
};

const formatRole = (role?: string) => {
  if (!role) {
    return "Member";
  }

  return role.replace(/^org:/, "").replace(/^\w/, (char) => char.toUpperCase());
};

const getStatusBadgeClassName = (status?: string) => {
  switch (status) {
    case "active":
    case "accepted":
      return "border border-emerald-500/30 bg-emerald-500/5 text-emerald-400";
    case "pending":
      return "border border-amber-500/30 bg-amber-500/5 text-amber-400";
    case "revoked":
      return "border border-zinc-500/30 bg-zinc-500/5 text-zinc-400";
    default:
      return "border border-white/10 bg-white/5 text-zinc-300";
  }
};

  return (
  <Card className="border-white/5 bg-[#0a0a0e]">
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-base font-medium text-white">
          Team Members
        </CardTitle>
        <CardDescription>Manage your team and their access.</CardDescription>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogTrigger
    render={
      <Button size="sm" className="bg-white text-black hover:bg-zinc-200" />
    }
  >
    <Plus className="w-4 h-4 mr-2" />
    Add Member
  </DialogTrigger>
  <DialogContent className="border-white/10 bg-[#0e0e12] text-white sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Add Team Member</DialogTitle>
    <DialogDescription className="text-zinc-400">
      Send an email invitation to join your organization through Clerk.
    </DialogDescription>
  </DialogHeader>
  <div className="grid gap-4 py-4">
  <div className="grid gap-2">
    <Label htmlFor="name" className="text-zinc-300">
      Name
    </Label>
    <Input
      id="name"
      placeholder="John Doe"
      value={newMemberName}
      onChange={(e) => setNewMemberName(e.target.value)}
      className="bg-white/5 border-white/10 text-white"
    />
  </div>
  <div className="grid gap-2">
  <Label htmlFor="email" className="text-zinc-300">
    Email
  </Label>
  <Input
    id="email"
    placeholder="john@example.com"
    value={newMemberEmail}
    onChange={(e) => setNewMemberEmail(e.target.value)}
    className="bg-white/5 border-white/10 text-white"
  />
</div>
<DialogFooter className='bg-[#0e0e12]'>
  <Button
    variant="outline"
    onClick={() => {
      setOpenDialog(false);
      setInviteError("");
    }}
    className="border-white/10 text-zinc-300 bg-black hover:bg-white/5 hover:text-white"
  >
    Cancel
  </Button>
  <Button
    onClick={handleAddMember}
    disabled={isAdding}
    className="bg-white text-black hover:bg-zinc-200"
  >
    {isAdding ? "Adding..." : "Add Member"}
  </Button>
</DialogFooter>
  </div>
</DialogContent>
</Dialog>
    </CardHeader>
    <CardContent className="space-y-4">
      {inviteSuccess ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm text-emerald-300">
          {inviteSuccess}
        </div>
      ) : null}

      {inviteError ? (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-red-300">
          {inviteError}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-zinc-400">
          Loading team members...
        </div>
      ) : team.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-zinc-400">
          No team members or pending invitations yet.
        </div>
      ) : (
        <div className="space-y-3">
          {team.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="border border-white/10 bg-white/5">
                  {member.image ? <AvatarImage src={member.image} alt={member.name} /> : null}
                  <AvatarFallback className="bg-white/10 text-zinc-200">
                    {getInitials(member.name, member.user_email)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {member.name}
                  </p>
                  <p className="truncate text-sm text-zinc-400">
                    {member.user_email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border border-white/10 bg-white/[0.03] text-zinc-300"
                >
                  {formatRole(member.role)}
                </Badge>
                <Badge
                  variant="outline"
                  className={getStatusBadgeClassName(member.status)}
                >
                  {member.status ?? "pending"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
}

export default TeamSection
