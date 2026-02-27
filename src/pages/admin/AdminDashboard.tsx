import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Users, Clock, Wallet, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const { employees, attendance, expenses, leaves } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter((a) => a.date === today);
  const pendingExpenses = expenses.filter((e) => e.status === 'pending');
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');

  const stats = [
    { label: 'Total Employees', value: employees.length, icon: Users, color: 'text-accent' },
    { label: 'Present Today', value: todayAttendance.length, icon: Clock, color: 'text-success' },
    { label: 'Pending Expenses', value: pendingExpenses.length, icon: Wallet, color: 'text-warning' },
    { label: 'Pending Leaves', value: pendingLeaves.length, icon: CalendarDays, color: 'text-destructive' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your organization</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Card key={stat.label} className="stat-card">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {todayAttendance.length === 0 ? (
              <p className="text-muted-foreground text-sm">No attendance records today</p>
            ) : (
              <div className="space-y-3">
                {todayAttendance.map((a) => {
                  const emp = employees.find((e) => e.id === a.employeeId);
                  return (
                    <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{emp?.name}</p>
                        <p className="text-xs text-muted-foreground">{emp?.id}</p>
                      </div>
                      <div className="text-right text-sm">
                        <span className="text-success font-medium">{a.inTime}</span>
                        {a.outTime && <span className="text-muted-foreground"> → {a.outTime}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingExpenses.length === 0 && pendingLeaves.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {pendingExpenses.slice(0, 3).map((e) => {
                  const emp = employees.find((em) => em.id === e.employeeId);
                  return (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{e.title}</p>
                        <p className="text-xs text-muted-foreground">Expense by {emp?.name}</p>
                      </div>
                      <span className="badge-pending text-xs px-2 py-1 rounded-full border font-medium">₹{e.amount}</span>
                    </div>
                  );
                })}
                {pendingLeaves.slice(0, 3).map((l) => {
                  const emp = employees.find((e) => e.id === l.employeeId);
                  return (
                    <div key={l.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium">{l.type} leave</p>
                        <p className="text-xs text-muted-foreground">By {emp?.name}</p>
                      </div>
                      <span className="badge-pending text-xs px-2 py-1 rounded-full border font-medium">Pending</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
