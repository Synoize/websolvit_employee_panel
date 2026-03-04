import { createContext, useContext, useState } from 'react';

// JWT Utilities
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const SECRET_KEY = import.meta.env.VITE_JWT_SECRET || 'your-secret-key-change-in-production';

const generateToken = (userId, role, userName) => {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60;

  const payload = { userId, role, userName, iat: now, exp: now + expiresIn };
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(SECRET_KEY);

  return `${header}.${body}.${signature}`;
};

const generateRefreshToken = (userId) => {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 7 * 24 * 60 * 60; // 7 days

  const payload = { userId, type: 'refresh', iat: now, exp: now + expiresIn };
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  const signature = btoa(SECRET_KEY);

  return `${header}.${body}.${signature}`;
};

const decodeToken = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob(parts[1]));
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload) return true;
  return payload.exp < Math.floor(Date.now() / 1000);
};

const setToken = (token, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const getToken = () => localStorage.getItem(TOKEN_KEY);
const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const getCurrentUserFromToken = () => {
  const token = getToken();
  if (!token || isTokenExpired(token)) {
    clearTokens();
    return null;
  }
  return decodeToken(token);
};

// API Functions
const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const url = `${BASE}${path}`;
  try {
    const hasBody = options.body !== undefined && options.body !== null;
    const headers = {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    };
    const res = await fetch(url, {
      headers,
      ...options,
    });
    if (!res.ok) {
      let errData = {};
      try { errData = await res.json(); } catch { errData = { message: res.statusText }; }
      throw new Error(errData.message || res.statusText || `HTTP ${res.status}`);
    }
    if (res.status === 204) return null;
    return res.json();
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${url}]:`, error);
    throw error;
  }
}

const api = {
  fetchEmployees: () => request('/api/employees'),
  createEmployee: (emp) => request('/api/employees', { method: 'POST', body: JSON.stringify(emp) }),
  login: (id, password) => request('/api/employees/login', { method: 'POST', body: JSON.stringify({ id, password }) }),
  fetchAttendance: () => request('/api/attendance'),
  recordAttendance: (data) => request('/api/attendance', { method: 'POST', body: JSON.stringify(data) }),
  updateAttendance: (id, data) => request(`/api/attendance/${id}/punch-out`, { method: 'PUT', body: JSON.stringify(data) }),
  fetchExpenses: () => request('/api/expenses'),
  createExpense: (expense) => request('/api/expenses', { method: 'POST', body: JSON.stringify(expense) }),
  updateExpense: (id, expense) => request(`/api/expenses/${id}/status`, { method: 'PUT', body: JSON.stringify(expense) }),
  deleteExpense: (id) => request(`/api/expenses/${id}`, { method: 'DELETE' }),
  fetchLeaves: () => request('/api/leaves'),
  createLeave: (leave) => request('/api/leaves', { method: 'POST', body: JSON.stringify(leave) }),
  updateLeave: (id, leave) => request(`/api/leaves/${id}/status`, { method: 'PUT', body: JSON.stringify(leave) }),
  deleteLeave: (id) => request(`/api/leaves/${id}`, { method: 'DELETE' }),
  updateEmployee: (id, emp) => request(`/api/employees/${id}`, { method: 'PUT', body: JSON.stringify(emp) }),
  deleteEmployee: (id) => request(`/api/employees/${id}`, { method: 'DELETE' }),
};

// Admin Login Config
const ADMIN_USERNAME = String(import.meta.env.VITE_ADMIN_USERNAME || '').trim().toLowerCase();
const ADMIN_EMAIL = String(import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
const ADMIN_PASSWORD = String(import.meta.env.VITE_ADMIN_PASSWORD || '').trim();

// Constants
export const COMPANY_LOCATION = { lat: Number(import.meta.env.VITE_COMPANY_LAT || 21.0874133), lng: Number(import.meta.env.VITE_COMPANY_LNG || 79.0940333) };
export const ALLOWED_RADIUS_METERS = Number(import.meta.env.VITE_COMPANY_RADIUS_METERS || 200);

// Helpers
const today = () => new Date().toISOString().split('T')[0];
const toDateOnly = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
};

// Context
const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const u = getCurrentUserFromToken();
    return u ? { id: u.userId, role: u.role, name: u.userName } : null;
  });
  const [isInitializing, setIsInitializing] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const initializeAuth = async () => {
    const u = getCurrentUserFromToken();
    if (u) setCurrentUser({ id: u.userId, role: u.role, name: u.userName });
    else setCurrentUser(null);
    await Promise.all([loadEmployees(), loadAttendance(), loadExpenses(), loadLeaves()]);
    setIsInitializing(false);
  };

  const login = async (id, password) => {
    const normalizedId = String(id || '').trim().toLowerCase();
    const normalizedPassword = String(password || '').trim();
    const isAdminId = normalizedId === ADMIN_USERNAME || (ADMIN_EMAIL && normalizedId === ADMIN_EMAIL);
    if (isAdminId && normalizedPassword === ADMIN_PASSWORD) {
      const token = generateToken('admin', 'admin', 'Admin');
      const refreshToken = generateRefreshToken('admin');
      setToken(token, refreshToken);
      const adminUser = { id: 'admin', role: 'admin', name: 'Admin' };
      setCurrentUser(adminUser);
      return adminUser;
    }
    if (isAdminId) {
      return null;
    }

    try {
      const resp = await api.login(id, password);
      if (resp && resp.user) {
        if (resp.user.role === 'admin') {
          return null;
        }
        if (resp.token) setToken(resp.token, '');
        const u = resp.user;
        const nextUser = { id: u._id || u.id, role: u.role, name: u.name };
        setCurrentUser(nextUser);
        return nextUser;
      }
    } catch (err) { console.error('login error', err); }
    return null;
  };

  const logout = () => { clearTokens(); setCurrentUser(null); };

  const loadEmployees = async () => {
    try {
      const emps = await api.fetchEmployees();
      setEmployees(emps.map((e) => ({ ...e, id: e._id })));
    } catch (err) { console.error('loadEmployees error', err); }
  };

  const loadAttendance = async () => {
    try {
      const recs = await api.fetchAttendance();
      setAttendance(recs.map((r) => ({ ...r, id: r._id, employeeId: String(r.employeeId), date: toDateOnly(r.date) })));
    } catch (err) { console.error('loadAttendance error', err); }
  };

  const loadExpenses = async () => {
    try {
      const ex = await api.fetchExpenses();
      setExpenses(ex.map((e) => ({ ...e, id: e._id, employeeId: String(e.employeeId), date: toDateOnly(e.date) })));
    } catch (err) { console.error('loadExpenses error', err); }
  };

  const loadLeaves = async () => {
    try {
      const lv = await api.fetchLeaves();
      setLeaves(lv.map((l) => ({ ...l, id: l._id, employeeId: String(l.employeeId), startDate: toDateOnly(l.startDate), endDate: toDateOnly(l.endDate), appliedOn: toDateOnly(l.appliedOn) })));
    } catch (err) { console.error('loadLeaves error', err); }
  };

  const addEmployee = async (emp) => {
    const newEmp = await api.createEmployee(emp);
    const normalized = { ...newEmp, id: newEmp._id };
    setEmployees((e) => [...e, normalized]);
    return newEmp._id;
  };

  const punchIn = async (employeeId, location) => {
    const todayDate = today();
    if (attendance.find((a) => a.employeeId === employeeId && a.date === todayDate)) return false;
    try {
      const rec = await api.recordAttendance({
        employeeId, date: todayDate,
        inTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        outTime: null, location, status: 'present',
      });
      setAttendance((a) => [...a, { ...rec, id: rec._id, employeeId: String(rec.employeeId), date: toDateOnly(rec.date) }]);
      return true;
    } catch (err) { console.error('punchIn error', err); return false; }
  };

  const punchOut = async (recordId, outTime) => {
    try {
      const updated = await api.updateAttendance(recordId, { outTime, status: 'present' });
      setAttendance((a) => a.map((x) => x.id === updated._id ? { ...updated, id: updated._id, employeeId: String(updated.employeeId), date: toDateOnly(updated.date) } : x));
      return true;
    } catch (err) { console.error('punchOut error', err); return false; }
  };

  const addExpense = async (expense) => {
    try {
      const result = await api.createExpense(expense);
      setExpenses((e) => [...e, { ...result, id: result._id, employeeId: String(result.employeeId), date: toDateOnly(result.date) }]);
      return result;
    } catch (err) { console.error('addExpense error', err); throw err; }
  };

  const updateExpenseStatus = async (id, status) => {
    try {
      const updated = await api.updateExpense(id, { status });
      setExpenses((e) => e.map((x) => x.id === updated._id ? { ...updated, id: updated._id, employeeId: String(updated.employeeId), date: toDateOnly(updated.date) } : x));
      return updated;
    } catch (err) { console.error('updateExpenseStatus error', err); throw err; }
  };

  const addLeave = async (leave) => {
    try {
      const lv = await api.createLeave({ ...leave, appliedOn: today() });
      setLeaves((l) => [...l, { ...lv, id: lv._id, employeeId: String(lv.employeeId), startDate: toDateOnly(lv.startDate), endDate: toDateOnly(lv.endDate), appliedOn: toDateOnly(lv.appliedOn) }]);
      return lv;
    } catch (err) { console.error('addLeave error', err); throw err; }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      const updated = await api.updateLeave(id, { status });
      setLeaves((l) => l.map((x) => x.id === updated._id ? { ...updated, id: updated._id, employeeId: String(updated.employeeId), startDate: toDateOnly(updated.startDate), endDate: toDateOnly(updated.endDate), appliedOn: toDateOnly(updated.appliedOn) } : x));
      return updated;
    } catch (err) { console.error('updateLeaveStatus error', err); throw err; }
  };

  const value = {
    currentUser, isInitializing, employees, attendance, expenses, leaves,
    login, logout, initializeAuth, setInitializing: (v) => setIsInitializing(v),
    loadEmployees, loadAttendance, loadExpenses, loadLeaves,
    addEmployee, punchIn, punchOut, addExpense, updateExpenseStatus, addLeave, updateLeaveStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppStore = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
};
