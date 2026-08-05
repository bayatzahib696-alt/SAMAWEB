-- =========================================================
-- SAMA Phase 2 Database Additions - FULL FIXED VERSION
-- Safe additive SQL: does not delete old data
-- Run in Supabase SQL Editor
-- =========================================================

-- ---------------------------------------------------------
-- 1. ENUM TYPES
-- ---------------------------------------------------------

DO $$
BEGIN
  CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.doctor_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pending', 'requested', 'confirmed', 'accepted', 'rejected', 'completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------
-- 2. CORE TABLES SAFETY
-- These may already exist from your old setup.
-- This section makes sure they exist and have needed columns.
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key,
  full_name text,
  phone text,
  role text,
  created_at timestamptz not null default now()
);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role text not null,
  created_at timestamptz not null default now()
);

ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS role text;
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.doctors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  full_name text,
  specialty text,
  license_number text,
  years_experience int,
  consultation_fee numeric,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS specialty text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS years_experience int;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS consultation_fee numeric;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS status text not null default 'pending';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS province text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS languages text[] not null default ARRAY['Dari']::text[];
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS profile_summary text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS average_rating numeric not null default 0;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS review_count int not null default 0;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS is_featured boolean not null default false;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS profile_photo_url text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS banner_url text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.patients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  full_name text,
  phone text,
  date_of_birth date,
  gender text,
  city text,
  province text,
  created_at timestamptz not null default now()
);

ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS user_id uuid;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS gender text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS province text;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  appointment_date date,
  appointment_time time,
  appointment_type text default 'online',
  reason text,
  notes text,
  status text not null default 'requested',
  created_at timestamptz not null default now()
);

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_date date;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_time time;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS appointment_type text default 'online';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS reason text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status text not null default 'requested';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

-- ---------------------------------------------------------
-- 3. PHASE 2 FEATURE TABLES
-- ---------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.specialties ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.specialties ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE public.specialties ADD COLUMN IF NOT EXISTS is_active boolean not null default true;
ALTER TABLE public.specialties ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

INSERT INTO public.specialties (name, description)
VALUES
  ('General Physician', 'General health consultation and primary care'),
  ('Pediatrician', 'Child and family healthcare'),
  ('Cardiologist', 'Heart and blood pressure care'),
  ('Dermatologist', 'Skin, hair, and nail care'),
  ('Gynecologist', 'Women health services'),
  ('Dentist', 'Dental and oral health services')
ON CONFLICT (name) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.doctor_availability_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid,
  day_of_week text,
  start_time time,
  end_time time,
  slot_type text not null default 'online',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS day_of_week text;
ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS start_time time;
ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS end_time time;
ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS slot_type text not null default 'online';
ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS is_active boolean not null default true;
ALTER TABLE public.doctor_availability_slots ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.patient_allergies (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid,
  allergy_name text,
  severity text,
  notes text,
  created_at timestamptz not null default now()
);

ALTER TABLE public.patient_allergies ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.patient_allergies ADD COLUMN IF NOT EXISTS allergy_name text;
ALTER TABLE public.patient_allergies ADD COLUMN IF NOT EXISTS severity text;
ALTER TABLE public.patient_allergies ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.patient_allergies ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.patient_medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  medication_name text,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  instructions text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS medication_name text;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS dosage text;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS frequency text;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS start_date date;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS end_date date;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS instructions text;
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS status text not null default 'active';
ALTER TABLE public.patient_medications ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.treatment_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  title text,
  diagnosis text,
  plan_notes text,
  follow_up_date date,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS diagnosis text;
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS plan_notes text;
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS follow_up_date date;
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS status text not null default 'active';
ALTER TABLE public.treatment_plans ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.lab_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  appointment_id uuid,
  test_name text,
  notes text,
  status text not null default 'requested',
  result_url text,
  created_at timestamptz not null default now()
);

ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS appointment_id uuid;
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS test_name text;
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS status text not null default 'requested';
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS result_url text;
ALTER TABLE public.lab_requests ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.care_coordination_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid,
  created_by uuid,
  request_type text not null default 'general',
  message text,
  priority text not null default 'normal',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS created_by uuid;
ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS request_type text not null default 'general';
ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS priority text not null default 'normal';
ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS status text not null default 'open';
ALTER TABLE public.care_coordination_requests ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.doctor_reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid,
  patient_id uuid,
  appointment_id uuid,
  rating int,
  review_text text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS patient_id uuid;
ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS appointment_id uuid;
ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS rating int;
ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS review_text text;
ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS is_public boolean not null default true;
ALTER TABLE public.doctor_reviews ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

CREATE TABLE IF NOT EXISTS public.doctor_posts (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid,
  title text,
  content text,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.doctor_posts ADD COLUMN IF NOT EXISTS doctor_id uuid;
ALTER TABLE public.doctor_posts ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.doctor_posts ADD COLUMN IF NOT EXISTS content text;
ALTER TABLE public.doctor_posts ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.doctor_posts ADD COLUMN IF NOT EXISTS is_published boolean not null default true;
ALTER TABLE public.doctor_posts ADD COLUMN IF NOT EXISTS created_at timestamptz not null default now();

-- ---------------------------------------------------------
-- 4. ENABLE RLS
-- ---------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_coordination_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_posts ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- 5. ROLE HELPER FUNCTION
-- Safe for user_roles.role as text or enum
-- ---------------------------------------------------------

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role::text = _role::text
  )
$$;

-- ---------------------------------------------------------
-- 6. POLICIES
-- ---------------------------------------------------------

-- PROFILES
DROP POLICY IF EXISTS "users read own profile" ON public.profiles;
CREATE POLICY "users read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "users update own profile" ON public.profiles;
CREATE POLICY "users update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- USER ROLES
DROP POLICY IF EXISTS "users read own role" ON public.user_roles;
CREATE POLICY "users read own role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "admins manage roles" ON public.user_roles;
CREATE POLICY "admins manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- DOCTORS
DROP POLICY IF EXISTS "public read approved doctors" ON public.doctors;
CREATE POLICY "public read approved doctors"
ON public.doctors
FOR SELECT
TO anon, authenticated
USING (
  status::text = 'approved'
  OR is_featured = true
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR user_id = auth.uid()
);

DROP POLICY IF EXISTS "doctors manage own profile" ON public.doctors;
CREATE POLICY "doctors manage own profile"
ON public.doctors
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- PATIENTS
DROP POLICY IF EXISTS "patients manage own patient profile" ON public.patients;
CREATE POLICY "patients manage own patient profile"
ON public.patients
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::public.app_role));

-- APPOINTMENTS
DROP POLICY IF EXISTS "participants manage appointments" ON public.appointments;
CREATE POLICY "participants manage appointments"
ON public.appointments
FOR ALL
TO authenticated
USING (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- SPECIALTIES
DROP POLICY IF EXISTS "public read active specialties" ON public.specialties;
CREATE POLICY "public read active specialties"
ON public.specialties
FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "admins manage specialties" ON public.specialties;
CREATE POLICY "admins manage specialties"
ON public.specialties
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- AVAILABILITY
DROP POLICY IF EXISTS "public read active availability" ON public.doctor_availability_slots;
CREATE POLICY "public read active availability"
ON public.doctor_availability_slots
FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "authenticated manage availability" ON public.doctor_availability_slots;
CREATE POLICY "authenticated manage availability"
ON public.doctor_availability_slots
FOR ALL
TO authenticated
USING (
  auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ALLERGIES
DROP POLICY IF EXISTS "patients manage own allergies" ON public.patient_allergies;
CREATE POLICY "patients manage own allergies"
ON public.patient_allergies
FOR ALL
TO authenticated
USING (
  auth.uid() = patient_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = patient_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- MEDICATIONS
DROP POLICY IF EXISTS "participants manage medications" ON public.patient_medications;
CREATE POLICY "participants manage medications"
ON public.patient_medications
FOR ALL
TO authenticated
USING (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- TREATMENT PLANS
DROP POLICY IF EXISTS "participants manage treatment plans" ON public.treatment_plans;
CREATE POLICY "participants manage treatment plans"
ON public.treatment_plans
FOR ALL
TO authenticated
USING (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- LAB REQUESTS
DROP POLICY IF EXISTS "participants manage lab requests" ON public.lab_requests;
CREATE POLICY "participants manage lab requests"
ON public.lab_requests
FOR ALL
TO authenticated
USING (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = patient_id
  OR auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- CARE COORDINATION
DROP POLICY IF EXISTS "participants manage care coordination" ON public.care_coordination_requests;
CREATE POLICY "participants manage care coordination"
ON public.care_coordination_requests
FOR ALL
TO authenticated
USING (
  auth.uid() = patient_id
  OR auth.uid() = created_by
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = patient_id
  OR auth.uid() = created_by
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- DOCTOR REVIEWS
DROP POLICY IF EXISTS "public read public doctor reviews" ON public.doctor_reviews;
CREATE POLICY "public read public doctor reviews"
ON public.doctor_reviews
FOR SELECT
TO anon, authenticated
USING (is_public = true);

DROP POLICY IF EXISTS "authenticated insert reviews" ON public.doctor_reviews;
CREATE POLICY "authenticated insert reviews"
ON public.doctor_reviews
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = patient_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "admins manage doctor reviews" ON public.doctor_reviews;
CREATE POLICY "admins manage doctor reviews"
ON public.doctor_reviews
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- DOCTOR POSTS
DROP POLICY IF EXISTS "public read published doctor posts" ON public.doctor_posts;
CREATE POLICY "public read published doctor posts"
ON public.doctor_posts
FOR SELECT
TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "doctors manage own posts" ON public.doctor_posts;
CREATE POLICY "doctors manage own posts"
ON public.doctor_posts
FOR ALL
TO authenticated
USING (
  auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  auth.uid() = doctor_id
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- ---------------------------------------------------------
-- 7. DEMO-FRIENDLY DOCTOR SEARCH VIEW
-- ---------------------------------------------------------

CREATE OR REPLACE VIEW public.doctor_search_cards AS
SELECT
  d.id,
  d.user_id,
  d.full_name,
  d.specialty,
  d.city,
  d.province,
  d.languages,
  d.years_experience,
  d.consultation_fee,
  d.profile_summary,
  d.average_rating,
  d.review_count,
  d.is_featured,
  d.profile_photo_url,
  d.banner_url,
  d.status,
  d.created_at
FROM public.doctors d
WHERE
  d.status::text = 'approved'
  OR d.is_featured = true;

-- ---------------------------------------------------------
-- 8. OPTIONAL DEMO POSTS / REVIEWS WITHOUT AUTH USERS
-- This section avoids inserting fake auth.users.
-- You can add real demo users later from Supabase Auth.
-- ---------------------------------------------------------

-- Done
SELECT 'SAMA Phase 2 database setup completed successfully.' AS message;