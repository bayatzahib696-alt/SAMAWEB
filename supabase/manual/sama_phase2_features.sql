-- SAMA phase 2 database additions
-- Run this in Supabase SQL Editor after your main setup-auth-working.sql / setup-advanced-features.sql.
-- This file is additive: it does not delete existing data.

DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.doctor_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'rejected', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

INSERT INTO public.specialties (name, description) VALUES
  ('General Physician', 'General health consultation and primary care'),
  ('Pediatrician', 'Child and family healthcare'),
  ('Cardiologist', 'Heart and blood pressure care'),
  ('Dermatologist', 'Skin, hair, and nail care'),
  ('Gynecologist', 'Women health services'),
  ('Dentist', 'Dental and oral health services')
ON CONFLICT (name) DO NOTHING;

ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS province text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS languages text[] not null default ARRAY['Dari']::text[];
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS profile_summary text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS average_rating numeric not null default 0;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS review_count int not null default 0;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS is_featured boolean not null default false;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS profile_photo_url text;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS banner_url text;

CREATE TABLE IF NOT EXISTS public.doctor_availability_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references auth.users(id) on delete cascade,
  day_of_week text not null,
  start_time time not null,
  end_time time not null,
  slot_type text not null default 'online',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.patient_allergies (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  allergy_name text not null,
  severity text,
  notes text,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.patient_medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid references auth.users(id) on delete set null,
  medication_name text not null,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  instructions text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.treatment_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid references auth.users(id) on delete set null,
  title text not null,
  diagnosis text,
  plan_notes text,
  follow_up_date date,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.lab_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  doctor_id uuid references auth.users(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  test_name text not null,
  notes text,
  status text not null default 'requested',
  result_url text,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.care_coordination_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  created_by uuid references auth.users(id) on delete set null,
  request_type text not null default 'general',
  message text not null,
  priority text not null default 'normal',
  status text not null default 'open',
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.doctor_reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references auth.users(id) on delete cascade,
  patient_id uuid references auth.users(id) on delete set null,
  appointment_id uuid references public.appointments(id) on delete set null,
  rating int check (rating between 1 and 5),
  review_text text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS public.doctor_posts (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_coordination_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_posts ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "public read active specialties" ON public.specialties;
CREATE POLICY "public read active specialties" ON public.specialties
FOR SELECT TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "public read public doctor reviews" ON public.doctor_reviews;
CREATE POLICY "public read public doctor reviews" ON public.doctor_reviews
FOR SELECT TO anon, authenticated USING (is_public = true);

DROP POLICY IF EXISTS "authenticated insert reviews" ON public.doctor_reviews;
CREATE POLICY "authenticated insert reviews" ON public.doctor_reviews
FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);

DROP POLICY IF EXISTS "authenticated manage availability" ON public.doctor_availability_slots;
CREATE POLICY "authenticated manage availability" ON public.doctor_availability_slots
FOR ALL TO authenticated USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "patients manage own allergies" ON public.patient_allergies;
CREATE POLICY "patients manage own allergies" ON public.patient_allergies
FOR ALL TO authenticated USING (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = patient_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "participants manage medications" ON public.patient_medications;
CREATE POLICY "participants manage medications" ON public.patient_medications
FOR ALL TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "participants manage treatment plans" ON public.treatment_plans;
CREATE POLICY "participants manage treatment plans" ON public.treatment_plans
FOR ALL TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "participants manage lab requests" ON public.lab_requests;
CREATE POLICY "participants manage lab requests" ON public.lab_requests
FOR ALL TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "participants manage care coordination" ON public.care_coordination_requests;
CREATE POLICY "participants manage care coordination" ON public.care_coordination_requests
FOR ALL TO authenticated USING (auth.uid() = patient_id OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = patient_id OR auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "public read published doctor posts" ON public.doctor_posts;
CREATE POLICY "public read published doctor posts" ON public.doctor_posts
FOR SELECT TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "doctors manage own posts" ON public.doctor_posts;
CREATE POLICY "doctors manage own posts" ON public.doctor_posts
FOR ALL TO authenticated USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin')) WITH CHECK (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
