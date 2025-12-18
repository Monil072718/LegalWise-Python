BEGIN;

CREATE SCHEMA IF NOT EXISTS public;

-- Optional (only if you want DB-generated UUID strings)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 1) Admins
-- =========================
CREATE TABLE IF NOT EXISTS public.admins (
  id              VARCHAR PRIMARY KEY,
  email           VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  role            VARCHAR NOT NULL DEFAULT 'admin',
  name            VARCHAR,
  "createdAt"     VARCHAR
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins (email);

-- =========================
-- 2) Lawyers
-- =========================
CREATE TABLE IF NOT EXISTS public.lawyers (
  id              VARCHAR PRIMARY KEY,
  name            VARCHAR,
  email           VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  role            VARCHAR NOT NULL DEFAULT 'lawyer',
  status          VARCHAR,
  specialization  JSONB NOT NULL DEFAULT '[]'::jsonb,
  experience      INTEGER NOT NULL DEFAULT 0,
  rating          DOUBLE PRECISION NOT NULL DEFAULT 0,
  "casesHandled"  INTEGER NOT NULL DEFAULT 0,
  availability    VARCHAR,
  verified        BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"     VARCHAR,
  documents       JSONB NOT NULL DEFAULT '[]'::jsonb,
  phone           VARCHAR,
  address         VARCHAR,
  bio             VARCHAR
);

CREATE INDEX IF NOT EXISTS idx_lawyers_email ON public.lawyers (email);
CREATE INDEX IF NOT EXISTS idx_lawyers_status ON public.lawyers (status);

-- =========================
-- 3) Clients
-- =========================
CREATE TABLE IF NOT EXISTS public.clients (
  id               VARCHAR PRIMARY KEY,
  name             VARCHAR,
  email            VARCHAR UNIQUE NOT NULL,
  role             VARCHAR NOT NULL DEFAULT 'client',
  status           VARCHAR,
  consultations    INTEGER NOT NULL DEFAULT 0,
  "booksDownloaded" INTEGER NOT NULL DEFAULT 0,
  "articlesRead"   INTEGER NOT NULL DEFAULT 0,
  "totalSpent"     DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt"      VARCHAR,
  avatar           VARCHAR,
  phone            VARCHAR,
  address          VARCHAR,
  company          VARCHAR,
  notes            VARCHAR
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients (email);

-- =========================
-- 4) Cases
-- =========================
CREATE TABLE IF NOT EXISTS public.cases (
  id            VARCHAR PRIMARY KEY,
  title         VARCHAR,
  "clientId"    VARCHAR,
  "lawyerId"    VARCHAR,
  status        VARCHAR,
  stage         VARCHAR,
  priority      VARCHAR,
  "createdAt"   VARCHAR,
  "nextHearing" VARCHAR,
  description   VARCHAR,
  documents     JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_cases_clientId ON public.cases ("clientId");
CREATE INDEX IF NOT EXISTS idx_cases_lawyerId ON public.cases ("lawyerId");

-- =========================
-- 5) Appointments
-- =========================
CREATE TABLE IF NOT EXISTS public.appointments (
  id           VARCHAR PRIMARY KEY,
  "clientName" VARCHAR,
  "lawyerName" VARCHAR,
  date         VARCHAR,
  time         VARCHAR,
  type         VARCHAR,
  status       VARCHAR,
  notes        VARCHAR
);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments (status);

-- =========================
-- 6) Payments
-- =========================
CREATE TABLE IF NOT EXISTS public.payments (
  id            VARCHAR PRIMARY KEY,
  "clientName"  VARCHAR,
  "lawyerName"  VARCHAR,
  amount        DOUBLE PRECISION NOT NULL DEFAULT 0,
  type          VARCHAR,
  status        VARCHAR,
  date          VARCHAR,
  "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments (status);

-- =========================
-- 7) Books
-- =========================
CREATE TABLE IF NOT EXISTS public.books (
  id            VARCHAR PRIMARY KEY,
  title         VARCHAR,
  author        VARCHAR,
  category      VARCHAR,
  price         DOUBLE PRECISION NOT NULL DEFAULT 0,
  downloads     INTEGER NOT NULL DEFAULT 0,
  rating        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "publishedAt" VARCHAR
);

-- =========================
-- 8) Articles
-- =========================
CREATE TABLE IF NOT EXISTS public.articles (
  id            VARCHAR PRIMARY KEY,
  title         VARCHAR,
  author        VARCHAR,
  category      VARCHAR,
  views         INTEGER NOT NULL DEFAULT 0,
  likes         INTEGER NOT NULL DEFAULT 0,
  "publishedAt" VARCHAR,
  status        VARCHAR
);

-- =========================
-- 9) Password resets
-- =========================
CREATE TABLE IF NOT EXISTS public.password_resets (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR NOT NULL,
  otp         VARCHAR NOT NULL,
  expires_at  VARCHAR NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_password_resets_email ON public.password_resets (email);

COMMIT;
