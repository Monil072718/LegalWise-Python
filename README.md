# LegalWise Admin & Lawyer Panel

A comprehensive legal management system built with Next.js (Frontend) and FastAPI (Backend). This platform serves two main user roles: Administrators and Lawyers, providing dedicated panels for managing legal cases, clients, appointments, and billing.

## 🚀 Features

### Admin Panel

- **Dashboard**: Overview of platform statistics.
- **Lawyer Management**: Create, verify, and manage lawyer accounts.
- **Client Management**: View and manage client details.
- **Case Management**: Oversee all legal cases on the platform.
- **Appointments**: View and manage scheduled appointments.
- **Billing & Payments**: Track revenue, invoices, and payment status.
- **Content Management**: Manage blogs, articles, and resources.

### Lawyer Panel

- **Dashboard**: Personalized view of active cases, requests, and appointments.
- **My Clients**: dedicated list of clients associated with the lawyer.
- **Case Management**: Manage assigned cases, upload documents, and track progress.
- **Appointments**: Calendar view for managing schedule and consultation requests.
- **Messaging**: Real-time communication with clients (In Progress).
- **Billing**: Generate invoices and track earnings.
- **Analytics**: Personal performance metrics.

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **State/API**: React Hooks, Axios

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.x
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens), Bcrypt (Password Hashing)
- **Real-time**: WebSockets

## 📂 Project Structure

```
legalwise-admin-next/
├── backend/                # FastAPI Backend
│   ├── routers/            # API Endpoints (auth, lawyers, cases, etc.)
│   ├── database.py         # Database connection
│   ├── models.py           # SQLAlchemy Models
│   ├── schemas.py          # Pydantic Schemas
│   └── main.py             # Application Entry Point
├── src/                    # Next.js Frontend
│   ├── app/                # App Router Pages
│   │   ├── admin/          # Admin Routes
│   │   ├── lawyer/         # Lawyer Routes
│   │   └── ...
│   ├── components/         # Reusable Components
│   ├── services/           # API Services
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

The backend API will be available at `http://localhost:8000`. API Docs: `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
# In the root directory
npm install
npm run dev
```

The frontend application will be running at `http://localhost:3000`.

## 🔐 Default Credentials

**Admin Login**: `http://localhost:3000/admin/login`

- **Email**: `admin@legalwise.com`
- **Password**: `admin123`

**Lawyer Login**: `http://localhost:3000/lawyer/login`

- Create a new lawyer via the Admin Panel first.

## 📝 License

This project is proprietary software.
