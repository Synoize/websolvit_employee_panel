import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

export default function AdminExpenses() {
  const { expenses, employees, updateExpenseStatus } = useAppStore();
  const { toast } = useToast();
  const sorted = [...expenses].sort((a, b) => (a.status === 'pending' ? -1 : 1));

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header">Expense Approvals</h1>
        <p className="text-muted-foreground mt-1">Review and approve employee expenses</p>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((e) => {
                const emp = employees.find((em) => em.id === e.employeeId);
                return (
                  <TableRow key={e.id}>
                    <TableCell>
                      <p className="font-medium">{emp?.name}</p>
                      <p className="text-xs text-muted-foreground">{e.employeeId}</p>
                    </TableCell>
                    <TableCell className="font-medium">{e.title}</TableCell>
                    <TableCell className="text-muted-foreground">{e.category}</TableCell>
                    <TableCell className="font-semibold">₹{e.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{e.date}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium ${e.status === 'approved' ? 'badge-approved' : e.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                        {e.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {e.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-success" onClick={() => { updateExpenseStatus(e.id, 'approved'); toast({ title: 'Expense approved' }); }}>
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-destructive" onClick={() => { updateExpenseStatus(e.id, 'rejected'); toast({ title: 'Expense rejected' }); }}>
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
