import { z } from 'zod';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  verificationOtp?: string;
  otpExpiresAt?: string;
  otpAttempts?: number;
  otpLockedUntil?: string;
  resetOtp?: string;
  resetOtpExpiresAt?: string;
  resetOtpAttempts?: number;
  resetOtpLockedUntil?: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuditLogEntry {
  timestamp: string;
  action: 'register' | 'verify_email' | 'login_success' | 'login_failure' | 'password_reset_request' | 'password_reset_complete';
  email: string;
  details?: string;
}

// Password requirements
export const passwordRequirements = [
  { key: 'minLength', label: 'Minimum 8 characters', test: (p: string) => p.length >= 8 },
  { key: 'uppercase', label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
  { key: 'number', label: 'At least 1 number', test: (p: string) => /\d/.test(p) },
  { key: 'special', label: 'At least 1 special character', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
] as const;

export function checkPasswordStrength(password: string) {
  return passwordRequirements.map(r => ({ ...r, met: r.test(password) }));
}

export function isPasswordStrong(password: string) {
  return passwordRequirements.every(r => r.test(password));
}

// Validation schemas
export const registerSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters')
    .refine(val => val.trim().length >= 3, 'Username cannot contain only spaces'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .refine(val => /[A-Z]/.test(val), 'Must contain an uppercase letter')
    .refine(val => /[a-z]/.test(val), 'Must contain a lowercase letter')
    .refine(val => /\d/.test(val), 'Must contain a number')
    .refine(val => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .refine(val => /[A-Z]/.test(val), 'Must contain an uppercase letter')
    .refine(val => /[a-z]/.test(val), 'Must contain a lowercase letter')
    .refine(val => /\d/.test(val), 'Must contain a number')
    .refine(val => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(val), 'Must contain a special character'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const verifyEmailSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
});

// Storage keys
const USERS_KEY = 'aquatrack_users';
const CURRENT_USER_KEY = 'aquatrack_current_user';
const AUDIT_LOG_KEY = 'aquatrack_audit_log';
const LOGIN_ATTEMPTS_KEY = 'aquatrack_login_attempts';

// OTP generation
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Audit logging
function addAuditLog(entry: Omit<AuditLogEntry, 'timestamp'>) {
  const logs: AuditLogEntry[] = JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
  logs.push({ ...entry, timestamp: new Date().toISOString() });
  // Keep last 500 entries
  if (logs.length > 500) logs.splice(0, logs.length - 500);
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
}

export function getAuditLogs(): AuditLogEntry[] {
  return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
}

// Login rate limiting
interface LoginAttemptRecord {
  count: number;
  lockedUntil?: string;
  lastAttempt: string;
}

function getLoginAttempts(email: string): LoginAttemptRecord {
  const all = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
  return all[email.toLowerCase()] || { count: 0, lastAttempt: new Date().toISOString() };
}

function setLoginAttempts(email: string, record: LoginAttemptRecord) {
  const all = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
  all[email.toLowerCase()] = record;
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(all));
}

function clearLoginAttempts(email: string) {
  const all = JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{}');
  delete all[email.toLowerCase()];
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(all));
}

// Default admin user
const defaultAdmin: User = {
  id: 'admin-001',
  username: 'Admin',
  email: 'admin@aquatrack.com',
  password: 'Admin123!',
  role: 'admin',
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
};

// Sample users
const sampleUsers: User[] = [
  defaultAdmin,
  {
    id: 'user-001',
    username: 'John Doe',
    email: 'john@example.com',
    password: 'Password1!',
    role: 'user',
    isActive: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-002',
    username: 'Jane Smith',
    email: 'jane@example.com',
    password: 'Password1!',
    role: 'user',
    isActive: true,
    isVerified: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-003',
    username: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'Password1!',
    role: 'user',
    isActive: false,
    isVerified: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initialize storage
function initializeStorage(): void {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
  }
}

// CRUD
export function getUsers(): User[] {
  initializeStorage();
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): CurrentUser | null {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function setCurrentUser(user: CurrentUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Register
export function registerUser(username: string, email: string, password: string): { success: boolean; message: string } {
  const users = getUsers();

  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'Email already in use.' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email: email.toLowerCase(),
    password,
    role: 'user',
    isActive: true,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  addAuditLog({ action: 'register', email: newUser.email });

  return { success: true, message: 'Account created successfully! You can now log in.' };
}




// Login
export function loginUser(email: string, password: string): { success: boolean; message: string; user?: CurrentUser } {
  // Rate limiting check
  const attempts = getLoginAttempts(email);
  if (attempts.lockedUntil && new Date(attempts.lockedUntil) > new Date()) {
    const mins = Math.ceil((new Date(attempts.lockedUntil).getTime() - Date.now()) / 60000);
    addAuditLog({ action: 'login_failure', email, details: 'Rate limited' });
    return { success: false, message: `Too many attempts. Please try again in ${mins} minute(s).` };
  }

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    const newCount = attempts.count + 1;
    const record: LoginAttemptRecord = { count: newCount, lastAttempt: new Date().toISOString() };
    if (newCount >= 5) {
      record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      record.count = 0;
    }
    setLoginAttempts(email, record);
    addAuditLog({ action: 'login_failure', email, details: 'Invalid credentials' });
    return { success: false, message: 'Invalid email or password.' };
  }

  if (!user.isActive) {
    return { success: false, message: 'This account has been deactivated.' };
  }


  clearLoginAttempts(email);

  const currentUser: CurrentUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  setCurrentUser(currentUser);
  addAuditLog({ action: 'login_success', email: user.email });

  return { success: true, message: 'Login successful!', user: currentUser };
}

// Logout
export function logoutUser(): void {
  clearCurrentUser();
}

// Forgot password – request OTP
export function requestPasswordReset(email: string): { success: boolean; message: string; otp?: string } {
  const genericMsg = 'If the email exists, we have sent reset instructions.';
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

  addAuditLog({ action: 'password_reset_request', email });

  if (idx === -1) return { success: true, message: genericMsg };

  const user = users[idx];
  const otp = generateOtp();
  user.resetOtp = otp;
  user.resetOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  user.resetOtpAttempts = 0;
  user.resetOtpLockedUntil = undefined;
  saveUsers(users);

  return { success: true, message: genericMsg, otp };
}

// Reset password with OTP
export function resetPassword(email: string, otp: string, newPassword: string): { success: boolean; message: string } {
  const users = getUsers();
  const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (idx === -1) return { success: false, message: 'Invalid reset request.' };

  const user = users[idx];

  if (user.resetOtpLockedUntil && new Date(user.resetOtpLockedUntil) > new Date()) {
    const mins = Math.ceil((new Date(user.resetOtpLockedUntil).getTime() - Date.now()) / 60000);
    return { success: false, message: `Too many incorrect attempts. Try again in ${mins} minute(s).` };
  }

  if (!user.resetOtpExpiresAt || new Date(user.resetOtpExpiresAt) < new Date()) {
    return { success: false, message: 'Reset code expired. Please request a new one.' };
  }

  if (user.resetOtp !== otp) {
    user.resetOtpAttempts = (user.resetOtpAttempts || 0) + 1;
    if (user.resetOtpAttempts >= 5) {
      user.resetOtpLockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      user.resetOtpAttempts = 0;
    }
    saveUsers(users);
    return { success: false, message: 'Incorrect reset code.' };
  }

  user.password = newPassword;
  user.resetOtp = undefined;
  user.resetOtpExpiresAt = undefined;
  user.resetOtpAttempts = 0;
  user.resetOtpLockedUntil = undefined;
  saveUsers(users);

  addAuditLog({ action: 'password_reset_complete', email: user.email });
  return { success: true, message: 'Password reset successfully! Please log in.' };
}

// Admin functions
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string } {
  const users = getUsers();

  if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return { success: false, message: 'An account with this email already exists' };
  }

  const newUser: User = {
    ...userData,
    id: `user-${Date.now()}`,
    email: userData.email.toLowerCase(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'User created successfully' };
}

export function updateUser(userId: string, updates: Partial<User>): { success: boolean; message: string } {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return { success: false, message: 'User not found' };
  }

  if (updates.email && updates.email.toLowerCase() !== users[index].email.toLowerCase()) {
    if (users.some(u => u.email.toLowerCase() === updates.email!.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists' };
    }
  }

  users[index] = { ...users[index], ...updates };
  saveUsers(users);

  return { success: true, message: 'User updated successfully' };
}

export function toggleUserStatus(userId: string): { success: boolean; message: string } {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return { success: false, message: 'User not found' };
  }

  if (users[index].id === 'admin-001' && users[index].isActive) {
    return { success: false, message: 'Cannot deactivate the primary admin account' };
  }

  users[index].isActive = !users[index].isActive;
  saveUsers(users);

  return {
    success: true,
    message: `User ${users[index].isActive ? 'activated' : 'deactivated'} successfully`,
  };
}

export function deleteUser(userId: string): { success: boolean; message: string } {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return { success: false, message: 'User not found' };
  }

  if (users[index].id === 'admin-001') {
    return { success: false, message: 'Cannot delete the primary admin account' };
  }

  users.splice(index, 1);
  saveUsers(users);

  return { success: true, message: 'User deleted successfully' };
}
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);

  if (index === -1) {
    return { success: false, message: 'User not found' };
  }

  if (users[index].id === 'admin-001' && users[index].isActive) {
    return { success: false, message: 'Cannot deactivate the primary admin account' };
  }

  users[index].isActive = !users[index].isActive;
  saveUsers(users);

  return {
    success: true,
    message: `User ${users[index].isActive ? 'activated' : 'deactivated'} successfully`,
  };
}
