import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdminAttendance() {
  const { attendance, employees } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = attendance
    .filter((a) => {
      const emp = employees.find((e) => e.id === a.employeeId);
      const matchesSearch = !search ||
        emp?.name.toLowerCase().includes(search.toLowerCase()) ||
        a.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        a.date.includes(search);
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesUser = userFilter === 'all' || a.employeeId === userFilter;
      const matchesDate = !dateFilter || a.date === dateFilter;
      return matchesSearch && matchesStatus && matchesUser && matchesDate;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="page-header text-xl md:text-2xl">Attendance Records</h1>
        <p className="text-muted-foreground text-sm mt-1">All employee attendance history</p>
      </div>

      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name, ID, or date..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[150px] h-9 text-xs">
              <SelectValue placeholder="All Employees" />
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
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card><CardContent className="text-center text-muted-foreground py-8 text-sm">No records found</CardContent></Card>
        )}
        {filtered.map((a) => {
          const emp = employees.find((e) => e.id === a.employeeId);
          return (
            <Card key={a.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link to={`/admin/employees/${a.employeeId}`} className="text-sm font-semibold hover:underline">
                      {emp?.name || a.employeeId}
                    </Link>
                    <p className="text-xs text-muted-foreground">{a.employeeId} · {a.date}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      In: <span className="text-success font-medium">{a.inTime || '-'}</span>
                      {' · '}Out: <span className="font-medium">{a.outTime || '-'}</span>
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${a.status === 'present' ? 'badge-approved' : a.status === 'leave' ? 'badge-pending' : 'badge-rejected'}`}>
                    {a.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
