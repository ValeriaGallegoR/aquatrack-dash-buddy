import { z } from 'zod';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

// Validation schemas
export const registerSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email must be less than 255 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
});

// Storage keys
const USERS_KEY = 'aquatrack_users';
const CURRENT_USER_KEY = 'aquatrack_current_user';

// Default admin user
const defaultAdmin: User = {
  id: 'admin-001',
  username: 'Admin',
  email: 'admin@aquatrack.com',
  password: 'admin123',
  role: 'admin',
  isActive: true,
  createdAt: new Date().toISOString(),
};

// Sample users for demo
const sampleUsers: User[] = [
  defaultAdmin,
  {
    id: 'user-001',
    username: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    isActive: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-002',
    username: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-003',
    username: 'Bob Wilson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user',
    isActive: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Initialize storage with sample data if empty
function initializeStorage(): void {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
  }
}

// Get all users
export function getUsers(): User[] {
  initializeStorage();
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// Save users
export function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get current logged-in user
export function getCurrentUser(): CurrentUser | null {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Set current user (login)
export function setCurrentUser(user: CurrentUser): void {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Clear current user (logout)
export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// Register a new user
export function registerUser(username: string, email: string, password: string): { success: boolean; message: string } {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: 'An account with this email already exists' };
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    email: email.toLowerCase(),
    password,
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  
  return { success: true, message: 'Registration successful! Please log in.' };
}

// Login user
export function loginUser(email: string, password: string): { success: boolean; message: string; user?: CurrentUser } {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }

  if (!user.isActive) {
    return { success: false, message: 'This account has been deactivated' };
  }

  if (user.password !== password) {
    return { success: false, message: 'Invalid email or password' };
  }

  const currentUser: CurrentUser = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  setCurrentUser(currentUser);
  
  return { success: true, message: 'Login successful!', user: currentUser };
}

// Logout user
export function logoutUser(): void {
  clearCurrentUser();
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

  // Check email uniqueness if email is being updated
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

  // Prevent deactivating the main admin
  if (users[index].id === 'admin-001' && users[index].isActive) {
    return { success: false, message: 'Cannot deactivate the primary admin account' };
  }

  users[index].isActive = !users[index].isActive;
  saveUsers(users);
  
  return { 
    success: true, 
    message: `User ${users[index].isActive ? 'activated' : 'deactivated'} successfully` 
  };
}
