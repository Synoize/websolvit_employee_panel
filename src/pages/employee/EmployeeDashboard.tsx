import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/store/useAppStore';
import { Clock, Wallet, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EmployeeDashboard() {
  const { currentUser, attendance, expenses, leaves } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const myAttendance = attendance.filter((a) => a.employeeId === currentUser?.id);
  const todayRecord = myAttendance.find((a) => a.date === today);
  const myExpenses = expenses.filter((e) => e.employeeId === currentUser?.id);
  const myLeaves = leaves.filter((l) => l.employeeId === currentUser?.id);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="page-header">Hello, {currentUser?.name} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's your overview for today</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-accent">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Status</p>
                <p className="text-lg font-bold">
                  {todayRecord ? (todayRecord.outTime ? 'Completed' : 'Punched In') : 'Not Punched'}
                </p>
                {todayRecord && (
                  <p className="text-xs text-muted-foreground">
                    In: {todayRecord.inTime} {todayRecord.outTime && `| Out: ${todayRecord.outTime}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-warning">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Expenses</p>
                <p className="text-lg font-bold">{myExpenses.filter((e) => e.status === 'pending').length}</p>
                <p className="text-xs text-muted-foreground">
                  Total: ₹{myExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardContent className="p-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-destructive">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leave Balance</p>
                <p className="text-lg font-bold">{myLeaves.filter((l) => l.status === 'approved').length} taken</p>
                <p className="text-xs text-muted-foreground">{myLeaves.filter((l) => l.status === 'pending').length} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {myAttendance.slice(-7).reverse().map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm font-medium">{a.date}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-success">{a.inTime}</span>
                  <span className="text-muted-foreground">{a.outTime || 'Working...'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${a.status === 'present' ? 'badge-approved' : 'badge-pending'}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
