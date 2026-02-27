import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAppStore, COMPANY_LOCATION, ALLOWED_RADIUS_METERS } from '@/store/useAppStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, LogIn, LogOut, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
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
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find((a) => a.employeeId === currentUser?.id && a.date === today);
  const myAttendance = attendance.filter((a) => a.employeeId === currentUser?.id).sort((a, b) => b.date.localeCompare(a.date));

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

  const handlePunchIn = () => {
    if (!location) {
      toast({ title: 'Location required', description: 'Please enable GPS', variant: 'destructive' });
      return;
    }
    if (!isInRange) {
      toast({ title: 'Out of range', description: 'You must be within office premises to punch in', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const success = punchIn(currentUser!.id, location);
      if (success) toast({ title: 'Punched In!', description: `Welcome! Time: ${new Date().toLocaleTimeString()}` });
      else toast({ title: 'Already punched in today', variant: 'destructive' });
      setLoading(false);
    }, 500);
  };

  const handlePunchOut = () => {
    setLoading(true);
    setTimeout(() => {
      const success = punchOut(currentUser!.id);
      if (success) toast({ title: 'Punched Out!', description: `See you tomorrow! Time: ${new Date().toLocaleTimeString()}` });
      else toast({ title: 'No active punch-in found', variant: 'destructive' });
      setLoading(false);
    }, 500);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="page-header">Attendance</h1>
        <p className="text-muted-foreground mt-1">Mark your daily attendance with GPS verification</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Punch Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
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
                    {isInRange
                      ? 'You can mark your attendance'
                      : `You need to be within ${ALLOWED_RADIUS_METERS}m of office`}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Fetching location...</p>
            )}

            <div className="text-center py-4">
              <p className="text-4xl font-bold">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-sm text-muted-foreground mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
          <CardHeader>
            <CardTitle className="text-lg">Attendance History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myAttendance.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.date}</TableCell>
                    <TableCell className="text-success">{a.inTime}</TableCell>
                    <TableCell className="text-muted-foreground">{a.outTime || 'Working...'}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${a.status === 'present' ? 'badge-approved' : 'badge-pending'}`}>
                        {a.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
