import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminLeaves() {
  const { leaves, employees, updateLeaveStatus } = useAppStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = leaves
    .filter((l) => {
      const emp = employees.find((e) => e.id === l.employeeId);
      const matchesSearch = !search ||
        emp?.name.toLowerCase().includes(search.toLowerCase()) ||
        l.reason.toLowerCase().includes(search.toLowerCase()) ||
        l.startDate.includes(search) ||
        l.endDate.includes(search);
      const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchesType = typeFilter === 'all' || l.type === typeFilter;
      const matchesUser = userFilter === 'all' || l.employeeId === userFilter;
      const matchesDate = !dateFilter || l.startDate === dateFilter || l.endDate === dateFilter;
      return matchesSearch && matchesStatus && matchesType && matchesUser && matchesDate;
    })
    .sort((a, b) => (a.status === 'pending' ? -1 : 1));

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="page-header text-xl md:text-2xl">Leave Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve leave requests</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by employee, reason, date..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="All Employees"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((e) => (
                <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        {filtered.length === 0 && (
          <Card><CardContent className="text-center text-muted-foreground py-8 text-sm">No leave requests found</CardContent></Card>
        )}
        {filtered.map((l) => {
          const emp = employees.find((e) => e.id === l.employeeId);
          return (
            <Card key={l.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold capitalize">{l.type} Leave</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      <Link to={`/admin/employees/${l.employeeId}`} className="hover:underline text-foreground/90">
                        {emp?.name || l.employeeId}
                      </Link>
                      {' · '} {l.startDate} {' → '} {l.endDate}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.reason}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${l.status === 'approved' ? 'badge-approved' : l.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                    {l.status}
                  </span>
                  {l.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-success" onClick={async () => { await updateLeaveStatus(l.id, 'approved'); toast({ title: 'Leave approved' }); }}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-destructive" onClick={async () => { await updateLeaveStatus(l.id, 'rejected'); toast({ title: 'Leave rejected' }); }}>
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
