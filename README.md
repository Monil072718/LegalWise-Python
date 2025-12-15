# LegalWise Admin & Lawyer Panel

A comprehensive legal management system built with Next.js (Frontend) and FastAPI (Backend). This platform serves two main user roles: Administrators and Lawyers, providing dedicated panels for managing legal cases, clients, appointments, and billing with advanced features like real-time search, invoice generation, and secure authentication.

## 🚀 Features

### 🔐 Authentication & Security (New)

- **Universal Login**: Single entry point (`/login`) for both Admins and Lawyers with automatic role-based redirection.
- **OTP-Based Password Reset**: Secure 3-step verification (Email Check -> 6-digit OTP -> New Password) using SMTP.
- **Secure Sessions**: JWT-based session management with auto-logout features.

### 🏛️ Admin Panel

- **Dashboard**: Overview of platform statistics (Lawyers, Cases, Revenue).
- **Lawyer Management**: Create, verify, and manage lawyer accounts.
- **Client Management**: View and manage distinct client profiles.
- **Case Management**: Oversee all legal cases across the platform.
- **Appointments**: View and manage scheduled appointments.
- **Billing & Payments**: Track total platform revenue and transaction history.
- **Content Management**: Manage blogs, legal articles, and resources.

### ⚖️ Lawyer Panel

- **Dashboard**: Personalized view of Active Cases, Pending Requests, and Today's Schedule.
- **My Clients**: dedicated list of clients with deep-dive profiles and case history.
- **Case Management**: Full lifecycle management (Open -> In Progress -> Closed) with document uploads and timeline tracking.
- **Appointments**: Interactive calendar and request management system (Accept/Decline).
- **Billing & Invoices**:
  - **Split-Screen Invoice Generator**: Create professional PDF invoices with real-time preview (using `jspdf`).
  - **Revenue Tracking**: Monitor paid vs. pending payments.
- **Search & Filters**: Comprehensive filtering and search capabilities across all modules.

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State/API**: React Hooks, Axios
- **PDF Generation**: jsPDF, jsPDF-AutoTable

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.x
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **ORM**: SQLAlchemy
- **Authentication**: JWT, Bcrypt, Python-Jose
- **Email**: SMTP (smtplib) with OTP support

## 📂 Project Structure

```
legalwise-admin-next/
├── backend/                # FastAPI Backend
│   ├── routers/            # API Endpoints (auth, lawyers, cases, etc.)
│   ├── utils/              # Utilities (email.py for SMTP)
│   ├── database.py         # Database connection
│   ├── models.py           # SQLAlchemy Models (PasswordReset, Lawyer, etc.)
│   ├── schemas.py          # Pydantic Schemas
│   └── main.py             # Application Entry Point
├── src/                    # Next.js Frontend
│   ├── app/                # App Router Pages
│   │   ├── admin/          # Admin Dashboard Routes
│   │   ├── lawyer/         # Lawyer Dashboard Routes
│   │   ├── (auth)/         # Authentication Routes (login, forgot-password)
│   │   └── ...
│   ├── components/         # Reusable Components (Sidebar, Navbar, StatsCard)
│   ├── services/           # Service Layer (api.ts)
│   └── types/              # TypeScript Interfaces
└── ...
```

## ⚡ Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Activate virtual environment:
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`.
API Docs (Swagger UI): `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# In the root directory
npm install
npm run dev
```

The frontend application will be running at `http://localhost:3000`.

## 🔐 Credentials & Testing

### Login

Go to: `http://localhost:3000/login`

- **Admin**: `admin@legalwise.com` / `admin123`
- **Lawyer**: Create a new lawyer via the Admin Panel, or use existing seeds.

### Password Reset

1. Go to Login -> Click "Forgot Password?"
2. Enter registered email.
3. Check Backend Terminal (or email inbox) for OTP.
4. Verify OTP and set new password.

## 📝 License

This project is proprietary software.
