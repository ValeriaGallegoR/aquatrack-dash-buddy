

# AquaTrack - Sprint 1 MVP Plan

## Overview
A water consumption tracking dashboard with user authentication, role-based access, and a clean admin panel. All data will be stored locally using localStorage for persistence across sessions.

---

## 🎨 Design Direction
- **Color Theme**: Blue & aqua tones (water-inspired palette)
- **Style**: Modern, clean, and minimal with good whitespace
- **Responsive**: Mobile-friendly layout throughout

---

## 📋 Features to Build

### 1. Authentication System
**Registration Page**
- Form with username, email, and password fields
- Client-side validation (required fields, email format, password strength)
- Success toast notification and redirect to login

**Login Page**
- Email and password login form
- Credential validation against localStorage users
- Error messaging for invalid credentials
- "Remember me" option (optional)

**Forgot Password Flow**
- Simple mocked flow with email input
- Success message confirming "reset email sent"

**Logout**
- Clear session and redirect to login

---

### 2. Role-Based Access
- **Two roles**: Admin and Regular User
- Default admin account pre-seeded (admin@aquatrack.com)
- Role stored with user data
- Route protection based on role
- Admins can access admin panel; regular users cannot

---

### 3. User Dashboard
**Clean layout with stat cards showing:**
- 💧 Total water used (last 30 days)
- 📅 Daily average consumption
- 📊 Weekly summary
- 📈 Monthly summary

**Additional elements:**
- Welcome message with user's name
- Simple navigation header
- Logout button

---

### 4. Admin Panel
**User Management Table:**
- View all registered users
- Create new users (with role assignment)
- Edit existing users (name, email, role)
- Deactivate/reactivate users
- Role assignment (Admin or User)

**Admin-only route protection**

---

## 📄 Pages Structure
1. `/login` - Login page
2. `/register` - Registration page
3. `/forgot-password` - Password reset (mocked)
4. `/dashboard` - User water usage dashboard
5. `/admin` - Admin panel (admin-only)

---

## 🗃️ Mock Data
- Pre-seeded admin user
- Simulated water usage data (randomized realistic values)
- Sample users for admin panel demo

---

## ✅ What's Included
- Full auth flow with localStorage
- Protected routes by authentication and role
- Responsive design for mobile
- Form validation with helpful error messages
- Toast notifications for user feedback

## ❌ What's Not Included (Per Scope)
- No real backend/database
- No cloud services
- No real sensor data
- No payments or billing
- No advanced analytics

