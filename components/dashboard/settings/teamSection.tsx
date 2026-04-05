import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger,DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'

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
  const [openDiaog, setOpenDialog] = useState(false);
//   const [memberToDelete, setMemberToDelete] = useState<string | null>(null);


useEffect(() => {
  fetchTeam();
}, []);


const fetchTeam = async () => {
  try {
    const res = await fetch("/api/team/fetch");
    if (res.ok) {
      const data = await res.json();
      setTeam(data.team);
    }
  } catch (error) {
    console.log(error, "Team member fetching error");
  } finally {
    setIsLoading(false);
  }
};

const handleAddMember = async () => {
  if (!newMemberEmail) return;

  setIsAdding(true);
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
  fetchTeam();
}
    
  } catch (error) {
    console.log(error, "Team member adding error");
  } finally {
    setIsAdding(false);
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
      <Dialog open={openDiaog} onOpenChange={setOpenDialog}>
  <DialogTrigger asChild>
    <Button size="sm" className="bg-white text-black hover:bg-zinc-200">
      <Plus className="w-4 h-4 mr-2" />
      Add Member
    </Button>
  </DialogTrigger>
  <DialogContent className="bg-[#0e0e12] border-white/10 text-white sm:max-">
  <DialogHeader>
    <DialogTitle>Add Team Member</DialogTitle>
    <DialogDescription className="text-zinc-400">
      Add a new member to your organization. They will be added
      immediately.
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
    onClick={() => setOpenDialog(false)}
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
  </Card>
);
}

export default TeamSection