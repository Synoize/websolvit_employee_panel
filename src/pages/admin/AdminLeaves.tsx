import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, X } from 'lucide-react';

export default function AdminLeaves() {
  const { leaves, employees, updateLeaveStatus } = useAppStore();
  const { toast } = useToast();
  const sorted = [...leaves].sort((a, b) => (a.status === 'pending' ? -1 : 1));

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="page-header text-xl md:text-2xl">Leave Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">Review and approve leave requests</p>
      </div>

      <div className="space-y-3">
        {sorted.map((l) => {
          const emp = employees.find((e) => e.id === l.employeeId);
          return (
            <Card key={l.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold capitalize">{l.type} Leave</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{emp?.name} · {l.startDate} → {l.endDate}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.reason}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${l.status === 'approved' ? 'badge-approved' : l.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                    {l.status}
                  </span>
                  {l.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-success" onClick={() => { updateLeaveStatus(l.id, 'approved'); toast({ title: 'Leave approved' }); }}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-destructive" onClick={() => { updateLeaveStatus(l.id, 'rejected'); toast({ title: 'Leave rejected' }); }}>
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
