import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore, COMPANY_LOCATION, ALLOWED_RADIUS_METERS } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, LogIn, LogOut, AlertTriangle, CheckCircle2, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function EmployeeAttendance() {
  const { currentUser, attendance, punchIn, punchOut } = useAppStore();
  const { toast } = useToast();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((a) => a.employeeId === currentUser?.id && a.date === today);
  const myAttendance = attendance
    .filter((a) => a.employeeId === currentUser?.id)
    .filter((a) => {
      const matchesSearch = !search || a.date.includes(search);
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesDate = !dateFilter || a.date === dateFilter;
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const isInRange = location
    ? getDistance(location.lat, location.lng, COMPANY_LOCATION.lat, COMPANY_LOCATION.lng) <= ALLOWED_RADIUS_METERS
    : false;

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLocationError('Location access denied. Please enable GPS to mark attendance.')
      );
    } else {
      setLocationError('Geolocation not supported');
    }
  }, []);

  const handlePunchIn = async () => {
    if (!location) { toast({ title: 'Location required', description: 'Please enable GPS', variant: 'destructive' }); return; }
    if (!isInRange) { toast({ title: 'Out of range', description: 'You must be within office premises to punch in', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const success = await punchIn(currentUser.id, location);
      if (success) toast({ title: 'Punched In!', description: `Welcome! Time: ${new Date().toLocaleTimeString()}` });
      else toast({ title: 'Already punched in today', variant: 'destructive' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to punch in', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePunchOut = async () => {
    if (!todayRecord) {
      toast({ title: 'No active punch-in found', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const outTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
      const success = await punchOut(todayRecord._id, outTime);
      if (success) toast({ title: 'Punched Out!', description: `See you tomorrow! Time: ${outTime}` });
      else toast({ title: 'Failed to punch out', variant: 'destructive' });
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to punch out', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4 md:mb-6">
        <h1 className="page-header text-xl md:text-2xl">Attendance</h1>
        <p className="text-muted-foreground text-sm mt-1">Mark your daily attendance with GPS verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Punch Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-accent" />
              Punch Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {locationError ? (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>{locationError}</p>
              </div>
            ) : location ? (
              <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${isInRange ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                {isInRange ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
                <div>
                  <p className="font-medium">{isInRange ? 'Within office range' : 'Outside office range'}</p>
                  <p className="text-xs opacity-70 mt-0.5">
                    {isInRange ? 'You can mark your attendance' : `You need to be within ${ALLOWED_RADIUS_METERS}m of office`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Fetching location...</p>
            )}

            <div className="text-center py-3">
              <p className="text-3xl md:text-4xl font-bold">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {todayRecord ? (
              todayRecord.outTime ? (
                <div className="text-center p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium">Attendance Complete</p>
                  <p className="text-xs text-muted-foreground mt-1">In: {todayRecord.inTime} | Out: {todayRecord.outTime}</p>
                </div>
              ) : (
                <Button onClick={handlePunchOut} disabled={loading} className="w-full" size="lg" variant="destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  {loading ? 'Processing...' : 'Punch Out'}
                </Button>
              )
            ) : (
              <Button onClick={handlePunchIn} disabled={loading || !isInRange || !location} className="w-full" size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                {loading ? 'Processing...' : 'Punch In'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* History */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search by date..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2">
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
              {myAttendance.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No records found</p>}
              {myAttendance.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
                  <div>
                    <p className="text-sm font-medium">{a.date}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      In: <span className="text-success font-medium">{a.inTime}</span>
                      {a.outTime && <> · Out: <span className="font-medium">{a.outTime}</span></>}
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
      </div>
    </DashboardLayout>
  );
}
