import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Search, Filter } from 'lucide-react';

export default function EmployeeLeaves() {
  const { currentUser, leaves, addLeave } = useAppStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: '', startDate: '', endDate: '', reason: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const myLeaves = leaves
    .filter((l) => l.employeeId === currentUser?.id)
    .filter((l) => {
      const matchesSearch = !search ||
        l.reason.toLowerCase().includes(search.toLowerCase()) ||
        l.startDate.includes(search) ||
        l.endDate.includes(search);
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchesType = typeFilter === 'all' || l.type === typeFilter;
      const matchesDate = !dateFilter || l.startDate === dateFilter || l.endDate === dateFilter;
      return matchesSearch && matchesStatus && matchesType && matchesDate;
    })
    .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.startDate || !form.endDate || !form.reason) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (form.startDate < new Date().toISOString().split('T')[0]) {
      toast({ title: 'Cannot apply for past dates', variant: 'destructive' });
      return;
    }
    try {
      await addLeave({ employeeId: currentUser.id, ...form });
      toast({ title: 'Leave request submitted' });
      setForm({ type: '', startDate: '', endDate: '', reason: '' });
      setOpen(false);
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to submit leave request', variant: 'destructive' });
    }
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
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
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

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by reason or date..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <Input
            type="date"
            className="w-auto h-9 text-sm"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <Filter className="w-3 h-3 mr-1.5" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="earned">Earned</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {myLeaves.length === 0 && (
          <Card><CardContent className="text-center text-muted-foreground py-8 text-sm">No leave requests found</CardContent></Card>
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
