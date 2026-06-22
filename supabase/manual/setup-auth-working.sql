-- SAMA: working Supabase Auth setup for Lovable project
-- Run this in Supabase Dashboard -> SQL Editor -> New Query -> Run.

-- 1) Make sure enums exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('patient','doctor','admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.doctor_status AS ENUM ('pending','approved','rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pending','confirmed','rejected','completed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('unpaid','paid','refunded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2) Tables
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL DEFAULT 'General Physician',
  license_number TEXT NOT NULL DEFAULT '',
  years_experience INT NOT NULL DEFAULT 0,
  consultation_fee NUMERIC NOT NULL DEFAULT 0,
  status public.doctor_status NOT NULL DEFAULT 'pending',
  bio TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  symptoms TEXT,
  status public.appointment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  diagnosis TEXT NOT NULL,
  medicine TEXT NOT NULL,
  instructions TEXT,
  follow_up_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'AFN',
  status public.payment_status NOT NULL DEFAULT 'unpaid',
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Helper function for roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4) Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 5) Drop duplicate old policies safely
DROP POLICY IF EXISTS "profiles readable by authenticated" ON public.profiles;
DROP POLICY IF EXISTS "users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "users insert own role on signup" ON public.user_roles;
DROP POLICY IF EXISTS "patients view own or admin" ON public.patients;
DROP POLICY IF EXISTS "patients insert own" ON public.patients;
DROP POLICY IF EXISTS "patients update own" ON public.patients;
DROP POLICY IF EXISTS "doctors public read" ON public.doctors;
DROP POLICY IF EXISTS "doctors insert self" ON public.doctors;
DROP POLICY IF EXISTS "doctors update self or admin" ON public.doctors;
DROP POLICY IF EXISTS "appointments participants or admin" ON public.appointments;
DROP POLICY IF EXISTS "patients create appointments" ON public.appointments;
DROP POLICY IF EXISTS "participants update appointments" ON public.appointments;
DROP POLICY IF EXISTS "prescriptions participants or admin" ON public.prescriptions;
DROP POLICY IF EXISTS "doctor creates prescription" ON public.prescriptions;
DROP POLICY IF EXISTS "payments participants or admin" ON public.payments;
DROP POLICY IF EXISTS "payments insert participant" ON public.payments;
DROP POLICY IF EXISTS "payments admin update" ON public.payments;
DROP POLICY IF EXISTS "messages participants" ON public.messages;
DROP POLICY IF EXISTS "messages send self" ON public.messages;

-- 6) Policies
CREATE POLICY "profiles readable by authenticated"
ON public.profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "users update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

CREATE POLICY "users insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "users read own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "patients view own or admin or doctor"
ON public.patients FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'doctor'));

CREATE POLICY "patients insert own"
ON public.patients FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "patients update own"
ON public.patients FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "doctors public read"
ON public.doctors FOR SELECT
USING (true);

CREATE POLICY "doctors insert self"
ON public.doctors FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "doctors update self or admin"
ON public.doctors FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "appointments participants or admin"
ON public.appointments FOR SELECT TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "patients create appointments"
ON public.appointments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "participants update appointments"
ON public.appointments FOR UPDATE TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "prescriptions participants or admin"
ON public.prescriptions FOR SELECT TO authenticated
USING (auth.uid() = doctor_id OR auth.uid() = patient_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "doctor creates prescription"
ON public.prescriptions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "payments participants or admin"
ON public.payments FOR SELECT TO authenticated
USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "payments insert participant"
ON public.payments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "payments admin update"
ON public.payments FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "messages participants"
ON public.messages FOR SELECT TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "messages send self"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- 7) Trigger: automatically create profile + role + patient/doctor row after signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_role public.app_role;
BEGIN
  new_role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'patient'::public.app_role);

  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name',''),
    NEW.raw_user_meta_data->>'phone',
    NEW.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, new_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  IF new_role = 'patient' THEN
    INSERT INTO public.patients (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  ELSIF new_role = 'doctor' THEN
    INSERT INTO public.doctors (
      user_id,
      specialty,
      license_number,
      years_experience,
      consultation_fee,
      status,
      bio
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'specialty','General Physician'),
      COALESCE(NEW.raw_user_meta_data->>'license_number',''),
      COALESCE((NEW.raw_user_meta_data->>'years_experience')::int, 0),
      COALESCE((NEW.raw_user_meta_data->>'consultation_fee')::numeric, 0),
      'pending',
      NEW.raw_user_meta_data->>'bio'
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8) Grants
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.patients TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.doctors TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointments TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.prescriptions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.payments TO authenticated;
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.profiles, public.user_roles, public.patients, public.doctors, public.appointments, public.prescriptions, public.payments, public.messages TO service_role;

-- 9) After creating your admin user in Supabase Auth, run this separately with that user's email:
-- INSERT INTO public.user_roles (user_id, role)
-- SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'YOUR_ADMIN_EMAIL@example.com'
-- ON CONFLICT (user_id, role) DO NOTHING;
