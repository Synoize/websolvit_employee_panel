import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export default function EmployeeLeaves() {
  const { currentUser, leaves, addLeave } = useAppStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: '' as any, startDate: '', endDate: '', reason: '' });

  const myLeaves = leaves.filter((l) => l.employeeId === currentUser?.id).sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.type || !form.startDate || !form.endDate || !form.reason) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (form.startDate < new Date().toISOString().split('T')[0]) {
      toast({ title: 'Cannot apply for past dates', variant: 'destructive' });
      return;
    }
    addLeave({ employeeId: currentUser!.id, ...form });
    toast({ title: 'Leave request submitted' });
    setForm({ type: '' as any, startDate: '', endDate: '', reason: '' });
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 className="page-header text-xl md:text-2xl">Leave Requests</h1>
          <p className="text-muted-foreground text-sm mt-1">Apply and track your leaves</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="md:size-default"><Plus className="w-4 h-4 mr-1 md:mr-2" /><span className="hidden sm:inline">Apply </span>Leave</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
            <DialogHeader><DialogTitle>Apply for Leave</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Leave Type *</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="earned">Earned Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>From *</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>To *</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reason *</Label>
                <Textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason for leave..." required />
              </div>
              <Button type="submit" className="w-full">Submit Request</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {myLeaves.length === 0 && (
          <Card><CardContent className="text-center text-muted-foreground py-8">No leave requests yet</CardContent></Card>
        )}
        {myLeaves.map((l) => (
          <Card key={l.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold capitalize">{l.type} Leave</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.startDate} → {l.endDate}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.reason}</p>
                </div>
                <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${l.status === 'approved' ? 'badge-approved' : l.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                  {l.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
