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
import { Plus, Search, Filter } from 'lucide-react';

export default function EmployeeExpenses() {
  const { currentUser, expenses, addExpense } = useAppStore();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', amount: '', category: '', description: '' });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const myExpenses = expenses
    .filter((e) => e.employeeId === currentUser?.id)
    .filter((e) => {
      const matchesSearch = !search ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.date.includes(search);
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.category) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    addExpense({
      employeeId: currentUser!.id,
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      description: form.description,
      date: new Date().toISOString().split('T')[0],
    });
    toast({ title: 'Expense submitted for approval' });
    setForm({ title: '', amount: '', category: '', description: '' });
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h1 className="page-header text-xl md:text-2xl">Expenses</h1>
          <p className="text-muted-foreground text-sm mt-1">Submit and track your expenses</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="md:size-default"><Plus className="w-4 h-4 mr-1 md:mr-2" /><span className="hidden sm:inline">New </span>Expense</Button>
          </DialogTrigger>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
            <DialogHeader><DialogTitle>Submit Expense</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Client dinner" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['Food', 'Travel', 'Accommodation', 'Office Supplies', 'Entertainment', 'Other'].map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Additional details..." />
              </div>
              <Button type="submit" className="w-full">Submit Expense</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title, category, date..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      <div className="space-y-3">
        {myExpenses.length === 0 && (
          <Card><CardContent className="text-center text-muted-foreground py-8 text-sm">No expenses found</CardContent></Card>
        )}
        {myExpenses.map((e) => (
          <Card key={e.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{e.category} · {e.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">₹{e.amount.toLocaleString()}</p>
                  <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full border font-medium ${e.status === 'approved' ? 'badge-approved' : e.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                    {e.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
