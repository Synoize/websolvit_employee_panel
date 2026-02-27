import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Building2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const login = useAppStore((s) => s.login);
  const currentUser = useAppStore((s) => s.currentUser);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(id.trim(), password)) {
      const user = useAppStore.getState().currentUser;
      navigate(user?.role === 'admin' ? '/admin' : '/employee');
    } else {
      toast({ title: 'Login Failed', description: 'Invalid ID or password', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-accent" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent" />
        </div>
        <div className="relative z-10 text-center px-12">
          <div className="w-20 h-20 rounded-2xl bg-accent mx-auto mb-8 flex items-center justify-center">
            <Building2 className="w-10 h-10 text-accent-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">AttendPro</h1>
          <p className="text-lg text-primary-foreground/70 max-w-md">
            Complete attendance, expense, and leave management for modern teams.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-primary-foreground/60 text-sm">
            <div>
              <div className="text-2xl font-bold text-accent">GPS</div>
              <div>Verified Punch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">Real-time</div>
              <div>Tracking</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">Smart</div>
              <div>Approvals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">AttendPro</h1>
          </div>

          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Sign in with your employee ID</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="empId">Employee ID or "admin"</Label>
              <Input
                id="empId"
                placeholder="e.g. EMP001 or admin"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          <div className="mt-8 p-4 rounded-lg bg-muted text-sm">
            <p className="font-medium mb-2">Demo Credentials:</p>
            <p className="text-muted-foreground">Admin: <span className="font-mono">admin / admin123</span></p>
            <p className="text-muted-foreground">Employee: <span className="font-mono">EMP001 / pass123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
