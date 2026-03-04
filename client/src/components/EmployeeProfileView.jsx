import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ArrowLeft } from 'lucide-react';

const statusBadgeClass = (status) => {
  if (status === 'approved' || status === 'present') return 'badge-approved';
  if (status === 'rejected' || status === 'absent') return 'badge-rejected';
  return 'badge-pending';
};

export default function EmployeeProfileView({ employeeId, isAdminView = false }) {
  const { currentUser, employees, attendance, expenses, leaves } = useAppStore();
  const targetId = employeeId || currentUser?.id;
  const employee = employees.find((e) => e.id === targetId);

  const [expenseSearch, setExpenseSearch] = useState('');
  const [expenseStatus, setExpenseStatus] = useState('all');
  const [expenseDate, setExpenseDate] = useState('');

  const [leaveSearch, setLeaveSearch] = useState('');
  const [leaveStatus, setLeaveStatus] = useState('all');
  const [leaveType, setLeaveType] = useState('all');
  const [leaveDate, setLeaveDate] = useState('');

  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('all');
  const [attendanceDate, setAttendanceDate] = useState('');

  const myExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.employeeId === targetId)
        .filter((e) => {
          const matchesSearch =
            !expenseSearch ||
            e.title.toLowerCase().includes(expenseSearch.toLowerCase()) ||
            e.category.toLowerCase().includes(expenseSearch.toLowerCase()) ||
            e.date.includes(expenseSearch);
          const matchesStatus = expenseStatus === 'all' || e.status === expenseStatus;
          const matchesDate = !expenseDate || e.date === expenseDate;
          return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, targetId, expenseSearch, expenseStatus, expenseDate]
  );

  const myLeaves = useMemo(
    () =>
      leaves
        .filter((l) => l.employeeId === targetId)
        .filter((l) => {
          const matchesSearch =
            !leaveSearch ||
            l.reason.toLowerCase().includes(leaveSearch.toLowerCase()) ||
            l.startDate.includes(leaveSearch) ||
            l.endDate.includes(leaveSearch);
          const matchesStatus = leaveStatus === 'all' || l.status === leaveStatus;
          const matchesType = leaveType === 'all' || l.type === leaveType;
          const matchesDate = !leaveDate || l.startDate === leaveDate || l.endDate === leaveDate;
          return matchesSearch && matchesStatus && matchesType && matchesDate;
        })
        .sort((a, b) => b.appliedOn.localeCompare(a.appliedOn)),
    [leaves, targetId, leaveSearch, leaveStatus, leaveType, leaveDate]
  );

  const myAttendance = useMemo(
    () =>
      attendance
        .filter((a) => a.employeeId === targetId)
        .filter((a) => {
          const matchesSearch = !attendanceSearch || a.date.includes(attendanceSearch);
          const matchesStatus = attendanceStatus === 'all' || a.status === attendanceStatus;
          const matchesDate = !attendanceDate || a.date === attendanceDate;
          return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [attendance, targetId, attendanceSearch, attendanceStatus, attendanceDate]
  );

  const totalExpenseAmount = myExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const approvedExpenseAmount = myExpenses
    .filter((e) => e.status === 'approved')
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const approvedLeaves = myLeaves.filter((l) => l.status === 'approved').length;
  const pendingLeaves = myLeaves.filter((l) => l.status === 'pending').length;
  const presentDays = myAttendance.filter((a) => a.status === 'present').length;

  if (!employee) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Employee not found.</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        {isAdminView && (
          <Link to="/admin/employees" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
            <ArrowLeft className="w-4 h-4" /> Back to Employees
          </Link>
        )}
        <h1 className="page-header text-xl md:text-2xl">{employee.name} - Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {employee.id} · {employee.department} · {employee.designation}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Total Expenses</p><p className="text-lg font-bold">Rs {totalExpenseAmount.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Approved Expense</p><p className="text-lg font-bold">Rs {approvedExpenseAmount.toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Approved Leaves</p><p className="text-lg font-bold">{approvedLeaves}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Pending Leaves</p><p className="text-lg font-bold">{pendingLeaves}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Present Days</p><p className="text-lg font-bold">{presentDays}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Expenses</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" value={expenseSearch} onChange={(e) => setExpenseSearch(e.target.value)} placeholder="Search expenses..." />
              </div>
              <div className="flex gap-2">
                <Input type="date" className="w-auto h-9 text-sm" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
                <Select value={expenseStatus} onValueChange={setExpenseStatus}>
                  <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              {myExpenses.length === 0 && <p className="text-xs text-muted-foreground">No expenses found</p>}
              {myExpenses.slice(0, 12).map((e) => (
                <div key={e.id} className="p-2.5 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{e.title}</p>
                    <p className="text-sm font-semibold">Rs {Number(e.amount || 0).toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{e.category} · {e.date}</p>
                  <span className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusBadgeClass(e.status)}`}>{e.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Leaves</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" value={leaveSearch} onChange={(e) => setLeaveSearch(e.target.value)} placeholder="Search leaves..." />
              </div>
              <div className="flex gap-2">
                <Input type="date" className="w-auto h-9 text-sm" value={leaveDate} onChange={(e) => setLeaveDate(e.target.value)} />
                <Select value={leaveStatus} onValueChange={setLeaveStatus}>
                  <SelectTrigger className="w-[110px] h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger className="w-[110px] h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Type</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="sick">Sick</SelectItem>
                    <SelectItem value="earned">Earned</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              {myLeaves.length === 0 && <p className="text-xs text-muted-foreground">No leaves found</p>}
              {myLeaves.slice(0, 12).map((l) => (
                <div key={l.id} className="p-2.5 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium capitalize">{l.type} leave</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusBadgeClass(l.status)}`}>{l.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{l.startDate} to {l.endDate}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{l.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Attendance</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2 mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" value={attendanceSearch} onChange={(e) => setAttendanceSearch(e.target.value)} placeholder="Search attendance..." />
              </div>
              <div className="flex gap-2">
                <Input type="date" className="w-auto h-9 text-sm" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} />
                <Select value={attendanceStatus} onValueChange={setAttendanceStatus}>
                  <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              {myAttendance.length === 0 && <p className="text-xs text-muted-foreground">No attendance found</p>}
              {myAttendance.slice(0, 15).map((a) => (
                <div key={a.id} className="p-2.5 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{a.date}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${statusBadgeClass(a.status)}`}>{a.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">In: {a.inTime || '-'} | Out: {a.outTime || '-'}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
