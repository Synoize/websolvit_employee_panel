import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Clock, Wallet, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmployeeDashboard() {
  const { currentUser, attendance, expenses, leaves } = useAppStore();
  const today = new Date().toISOString().split('T')[0];
  const myAttendance = attendance.filter((a) => a.employeeId === currentUser?.id);
  const todayRecord = myAttendance.find((a) => a.date === today);
  const myExpenses = expenses.filter((e) => e.employeeId === currentUser?.id);
  const myLeaves = leaves.filter((l) => l.employeeId === currentUser?.id);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header text-xl md:text-2xl">Hello, {currentUser?.name} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your overview for today</p>
        <Link to="/employee/profile">
          <Button variant="outline" size="sm" className="mt-3">View Full Profile</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="stat-card !p-4 md:!p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center text-accent shrink-0">
                <Clock className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Today's Status</p>
                <p className="text-base md:text-lg font-bold truncate">
                  {todayRecord ? (todayRecord.outTime ? 'Completed' : 'Punched In') : 'Not Punched'}
                </p>
                {todayRecord && (
                  <p className="text-xs text-muted-foreground truncate">
                    In: {todayRecord.inTime} {todayRecord.outTime && `| Out: ${todayRecord.outTime}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card !p-4 md:!p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center text-warning shrink-0">
                <Wallet className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending Expenses</p>
                <p className="text-base md:text-lg font-bold">{myExpenses.filter((e) => e.status === 'pending').length}</p>
                <p className="text-xs text-muted-foreground">
                  Total: ₹{myExpenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="stat-card !p-4 md:!p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-muted flex items-center justify-center text-destructive shrink-0">
                <CalendarDays className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Leave Balance</p>
                <p className="text-base md:text-lg font-bold">{myLeaves.filter((l) => l.status === 'approved').length} taken</p>
                <p className="text-xs text-muted-foreground">{myLeaves.filter((l) => l.status === 'pending').length} pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Recent Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {myAttendance.slice(-7).reverse().map((a) => (
              <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">{a.date}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    In: <span className="text-success">{a.inTime}</span>
                    {a.outTime && <> · Out: {a.outTime}</>}
                    {!a.outTime && <span className="text-accent"> · Working...</span>}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${a.status === 'present' ? 'badge-approved' : 'badge-pending'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
