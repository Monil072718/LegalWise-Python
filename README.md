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
- **Service Categories**: Manage expert legal categories and rates.
- **Inventory (Books)**: Manage physical/digital book inventory.
- **Content Management**: Manage blogs, legal articles (with URL import), and resources.

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
- **Database**: PostgreSQL (via Docker)
- **ORM**: SQLAlchemy
- **Authentication**: JWT, Bcrypt, Python-Jose
- **Email**: SMTP (smtplib) with OTP support

## ⚡ Getting Started (Docker - Recommended)

### Prerequisites

- **Docker Desktop**: Install and ensure it is running.

### Run Application

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd legalwise-admin-next
    ```

2.  **Start with Docker Compose**:

    ```bash
    docker-compose up --build -d
    ```

    This command will:

    - Build the Next.js frontend image.
    - Build the FastAPI backend image.
    - Start a PostgreSQL database container.
    - Launch the entire application stack.

3.  **Access the App**:

    - **Frontend**: `http://localhost:3000`
    - **Backend API**: `http://localhost:8000`
    - **API Docs**: `http://localhost:8000/docs`

4.  **Stop Application**:
    ```bash
    docker-compose down
    ```

---

## 🔧 Manual Setup (Alternative)

If you prefer to run locally without Docker:

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

### 2. Frontend Setup

```bash
# In the root directory
yarn install
yarn dev
```

The frontend application will be running at `http://localhost:3000`.

## 🚀 Deployment

### 1. Backend (Render)

1.  Create a new **Web Service** on Render connected to your repo.
2.  **Root Directory**: `backend`
3.  **Build Command**: `pip install -r requirements.txt`
4.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables**:
    - `DATABASE_URL`: Your PostgreSQL connection string (Internal URL if using Render Postgres).
    - `Use a Secret File`: recommended for .env management.

### 2. Frontend (Vercel)

1.  Import your repository into Vercel.
2.  **Framework Preset**: Next.js
3.  **Build Command**: `yarn build` (Vercel detects Yarn automatically).
4.  **Environment Variables**:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed Backend (e.g., `https://legalwise-python.onrender.com`).
      _Note: Do not add a trailing slash._
5.  **Deploy**: Vercel handles the build and deployment.

**Troubleshooting Builds**:
If you encounter React version errors, ensure you are using the stable `yarn.lock` provided in this repo which pins React to version 18.

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
