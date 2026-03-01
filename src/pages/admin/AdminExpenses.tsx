import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminExpenses() {
  const { expenses, employees, updateExpenseStatus } = useAppStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [...new Set(expenses.map(e => e.category))];

  const filtered = expenses
    .filter((e) => {
      const emp = employees.find((em) => em.id === e.employeeId);
      const matchesSearch = !search || 
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        emp?.name.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase()) ||
        e.date.includes(search);
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => (a.status === 'pending' ? -1 : 1));

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="page-header text-xl md:text-2xl">Expense Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve employee expenses</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by title, employee, category..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="text-center text-muted-foreground py-8 text-sm">No expenses found</CardContent></Card>
        )}
        {filtered.map((e) => {
          const emp = employees.find((em) => em.id === e.employeeId);
          return (
            <Card key={e.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{e.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{emp?.name} · {e.category} · {e.date}</p>
                  </div>
                  <p className="text-sm font-bold shrink-0">₹{e.amount.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${e.status === 'approved' ? 'badge-approved' : e.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                    {e.status}
                  </span>
                  {e.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-success" onClick={() => { updateExpenseStatus(e.id, 'approved'); toast({ title: 'Expense approved' }); }}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-destructive" onClick={() => { updateExpenseStatus(e.id, 'rejected'); toast({ title: 'Expense rejected' }); }}>
                        <X className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
