import { create } from 'zustand';

export type UserRole = 'admin' | 'employee';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  phone: string;
  joinDate: string;
  password: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  inTime: string | null;
  outTime: string | null;
  location: { lat: number; lng: number } | null;
  status: 'present' | 'absent' | 'half-day' | 'leave';
}

export interface Expense {
  id: string;
  employeeId: string;
  title: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'casual' | 'sick' | 'earned' | 'unpaid';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: string;
}

// Company location for geo-fencing (example: office coordinates)
export const COMPANY_LOCATION = { lat: 28.6139, lng: 77.2090 }; // Delhi
export const ALLOWED_RADIUS_METERS = 200;

interface AppState {
  currentUser: { id: string; role: UserRole; name: string } | null;
  employees: Employee[];
  attendance: AttendanceRecord[];
  expenses: Expense[];
  leaves: LeaveRequest[];
  login: (id: string, password: string) => boolean;
  logout: () => void;
  addEmployee: (emp: Omit<Employee, 'id'>) => string;
  punchIn: (employeeId: string, location: { lat: number; lng: number }) => boolean;
  punchOut: (employeeId: string) => boolean;
  addExpense: (expense: Omit<Expense, 'id' | 'status'>) => void;
  updateExpenseStatus: (id: string, status: 'approved' | 'rejected') => void;
  addLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  updateLeaveStatus: (id: string, status: 'approved' | 'rejected') => void;
}

const generateId = () => Math.random().toString(36).substring(2, 10).toUpperCase();

const today = () => new Date().toISOString().split('T')[0];

// Seed data
const seedEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Rahul Sharma',
    email: 'rahul@company.com',
    department: 'Engineering',
    designation: 'Software Engineer',
    phone: '9876543210',
    joinDate: '2024-01-15',
    password: 'pass123',
  },
  {
    id: 'EMP002',
    name: 'Priya Patel',
    email: 'priya@company.com',
    department: 'Marketing',
    designation: 'Marketing Manager',
    phone: '9876543211',
    joinDate: '2024-03-01',
    password: 'pass123',
  },
  {
    id: 'EMP003',
    name: 'Amit Kumar',
    email: 'amit@company.com',
    department: 'Finance',
    designation: 'Accountant',
    phone: '9876543212',
    joinDate: '2024-06-10',
    password: 'pass123',
  },
];

const seedAttendance: AttendanceRecord[] = [
  { id: 'ATT001', employeeId: 'EMP001', date: '2026-02-26', inTime: '09:05', outTime: '18:10', location: { lat: 28.6139, lng: 77.2090 }, status: 'present' },
  { id: 'ATT002', employeeId: 'EMP002', date: '2026-02-26', inTime: '09:15', outTime: '17:50', location: { lat: 28.6139, lng: 77.2090 }, status: 'present' },
  { id: 'ATT003', employeeId: 'EMP001', date: '2026-02-25', inTime: '09:00', outTime: '18:00', location: { lat: 28.6139, lng: 77.2090 }, status: 'present' },
];

const seedExpenses: Expense[] = [
  { id: 'EXP001', employeeId: 'EMP001', title: 'Client Lunch', amount: 1500, category: 'Food', description: 'Lunch with client at hotel', date: '2026-02-25', status: 'pending' },
  { id: 'EXP002', employeeId: 'EMP002', title: 'Travel to Mumbai', amount: 5200, category: 'Travel', description: 'Flight tickets for conference', date: '2026-02-24', status: 'approved' },
];

const seedLeaves: LeaveRequest[] = [
  { id: 'LV001', employeeId: 'EMP003', type: 'casual', startDate: '2026-03-01', endDate: '2026-03-02', reason: 'Family function', status: 'pending', appliedOn: '2026-02-26' },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  employees: seedEmployees,
  attendance: seedAttendance,
  expenses: seedExpenses,
  leaves: seedLeaves,

  login: (id, password) => {
    if (id === 'admin' && password === 'admin123') {
      set({ currentUser: { id: 'admin', role: 'admin', name: 'Admin' } });
      return true;
    }
    const emp = get().employees.find((e) => e.id === id && e.password === password);
    if (emp) {
      set({ currentUser: { id: emp.id, role: 'employee', name: emp.name } });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null }),

  addEmployee: (emp) => {
    const id = 'EMP' + String(get().employees.length + 1).padStart(3, '0');
    set((s) => ({ employees: [...s.employees, { ...emp, id }] }));
    return id;
  },

  punchIn: (employeeId, location) => {
    const todayDate = today();
    const existing = get().attendance.find((a) => a.employeeId === employeeId && a.date === todayDate);
    if (existing) return false;
    const record: AttendanceRecord = {
      id: 'ATT' + generateId(),
      employeeId,
      date: todayDate,
      inTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
      outTime: null,
      location,
      status: 'present',
    };
    set((s) => ({ attendance: [...s.attendance, record] }));
    return true;
  },

  punchOut: (employeeId) => {
    const todayDate = today();
    const records = get().attendance;
    const idx = records.findIndex((a) => a.employeeId === employeeId && a.date === todayDate && !a.outTime);
    if (idx === -1) return false;
    const updated = [...records];
    updated[idx] = {
      ...updated[idx],
      outTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    set({ attendance: updated });
    return true;
  },

  addExpense: (expense) => {
    set((s) => ({
      expenses: [...s.expenses, { ...expense, id: 'EXP' + generateId(), status: 'pending' }],
    }));
  },

  updateExpenseStatus: (id, status) => {
    set((s) => ({
      expenses: s.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
  },

  addLeave: (leave) => {
    set((s) => ({
      leaves: [
        ...s.leaves,
        { ...leave, id: 'LV' + generateId(), status: 'pending', appliedOn: today() },
      ],
    }));
  },

  updateLeaveStatus: (id, status) => {
    set((s) => ({
      leaves: s.leaves.map((l) => (l.id === id ? { ...l, status } : l)),
    }));
  },
}));
