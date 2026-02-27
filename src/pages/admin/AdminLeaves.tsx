import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

export default function AdminLeaves() {
  const { leaves, employees, updateLeaveStatus } = useAppStore();
  const { toast } = useToast();
  const sorted = [...leaves].sort((a, b) => (a.status === 'pending' ? -1 : 1));

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header">Leave Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve leave requests</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((l) => {
                const emp = employees.find((e) => e.id === l.employeeId);
                return (
                  <TableRow key={l.id}>
                    <TableCell>
                      <p className="font-medium">{emp?.name}</p>
                      <p className="text-xs text-muted-foreground">{l.employeeId}</p>
                    </TableCell>
                    <TableCell className="capitalize">{l.type}</TableCell>
                    <TableCell>{l.startDate}</TableCell>
                    <TableCell>{l.endDate}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{l.reason}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${l.status === 'approved' ? 'badge-approved' : l.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                        {l.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {l.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-success" onClick={() => { updateLeaveStatus(l.id, 'approved'); toast({ title: 'Leave approved' }); }}>
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-destructive" onClick={() => { updateLeaveStatus(l.id, 'rejected'); toast({ title: 'Leave rejected' }); }}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
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
