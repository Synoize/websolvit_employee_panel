import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function AdminAttendance() {
  const { attendance, employees } = useAppStore();
  const [search, setSearch] = useState('');

  const sorted = [...attendance].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = sorted.filter((a) => {
    const emp = employees.find((e) => e.id === a.employeeId);
    return (
      emp?.name.toLowerCase().includes(search.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      a.date.includes(search)
    );
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header">Attendance Records</h1>
        <p className="text-muted-foreground mt-1">All employee attendance history</p>
      </div>
      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search by name, ID, or date..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>In Time</TableHead>
                <TableHead>Out Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => {
                const emp = employees.find((e) => e.id === a.employeeId);
                return (
                  <TableRow key={a.id}>
                    <TableCell>
                      <p className="font-medium">{emp?.name}</p>
                      <p className="text-xs text-muted-foreground">{a.employeeId}</p>
                    </TableCell>
                    <TableCell>{a.date}</TableCell>
                    <TableCell className="text-success font-medium">{a.inTime || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">{a.outTime || '-'}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${a.status === 'present' ? 'badge-approved' : a.status === 'leave' ? 'badge-pending' : 'badge-rejected'}`}>
                        {a.status}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
