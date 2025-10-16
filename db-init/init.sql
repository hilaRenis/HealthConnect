-- Create tables for the HealthConnect application

-- Auth Service
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  name TEXT,
  email TEXT UNIQUE,
  passwordHash TEXT
);

-- Seed a default admin user
INSERT INTO users (id, role, name, email, passwordHash)
SELECT 'default-admin', 'admin', 'Admin', 'admin@healthconnect.com', 'adminpass'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@healthconnect.com');

-- Patient Service
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  name TEXT,
  dob TEXT,
  conditions TEXT[]
);

CREATE TABLE IF NOT EXISTS prescription_requests (
  id TEXT PRIMARY KEY,
  patientId TEXT NOT NULL,
  medication TEXT,
  notes TEXT,
  status TEXT
);

-- Doctor Service
CREATE TABLE IF NOT EXISTS doctors (
  id TEXT PRIMARY KEY,
  specialty TEXT
);

CREATE TABLE IF NOT EXISTS doctor_patient_map (
  doctorId TEXT NOT NULL,
  patientId TEXT NOT NULL,
  PRIMARY KEY (doctorId, patientId)
);

CREATE TABLE IF NOT EXISTS schedule (
  id TEXT PRIMARY KEY,
  doctorUserId TEXT NOT NULL,
  date TEXT,
  slot TEXT
);

-- Appointment Service
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patientUserId TEXT NOT NULL,
  doctorUserId TEXT NOT NULL,
  date TEXT,
  slot TEXT,
  status TEXT
);

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS startTime TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS endTime TIMESTAMPTZ;
