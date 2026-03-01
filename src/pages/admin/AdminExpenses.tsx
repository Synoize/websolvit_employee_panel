import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

export default function AdminExpenses() {
  const { expenses, employees, updateExpenseStatus } = useAppStore();
  const { toast } = useToast();
  const sorted = [...expenses].sort((a, b) => (a.status === 'pending' ? -1 : 1));

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="page-header text-xl md:text-2xl">Expense Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve employee expenses</p>
      </div>

      <div className="space-y-3">
        {sorted.map((e) => {
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
