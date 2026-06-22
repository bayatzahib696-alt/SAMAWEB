-- AFGHAN HEALTHEASE CONNECT - ADVANCED MVP DATABASE SETUP
-- Use this in Supabase SQL Editor after creating your Supabase project.
-- It creates/updates tables for: doctor profile banners, patient allergies,
-- doctor posts, doctor reviews, and doctor communication with labs/pharmacy/clinic/admin.

-- 1) Base enums
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.doctor_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'rejected', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'refunded');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'hidden');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.partner_type AS ENUM ('lab', 'pharmacy', 'clinic', 'admin', 'other_doctor');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.partner_message_status AS ENUM ('sent', 'reviewed', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Base tables
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
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
  years_experience INTEGER NOT NULL DEFAULT 0,
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
  diagnosis TEXT NOT NULL DEFAULT '',
  medicine TEXT NOT NULL DEFAULT '',
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
  message_text TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Advanced doctor profile columns
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS profile_photo_url TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS languages TEXT[] NOT NULL DEFAULT ARRAY['Dari']::TEXT[];
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS clinic_name TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS availability TEXT;

-- 4) Advanced feature tables
CREATE TABLE IF NOT EXISTS public.patient_medical_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  allergies TEXT,
  current_medications TEXT,
  chronic_conditions TEXT,
  medical_notes TEXT,
  blood_type TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  status public.post_status NOT NULL DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.doctor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(appointment_id)
);

CREATE TABLE IF NOT EXISTS public.partner_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  partner_type public.partner_type NOT NULL,
  partner_name TEXT,
  message TEXT NOT NULL,
  status public.partner_message_status NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Helper function
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
  );
$$;

-- 6) Signup trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  role_text TEXT;
  clean_role public.app_role;
  clean_years INTEGER;
  clean_fee NUMERIC;
BEGIN
  role_text := lower(coalesce(nullif(NEW.raw_user_meta_data->>'role', ''), 'patient'));
  IF role_text NOT IN ('patient', 'doctor', 'admin') THEN role_text := 'patient'; END IF;
  clean_role := role_text::public.app_role;

  BEGIN
    clean_years := coalesce(nullif(NEW.raw_user_meta_data->>'years_experience', '')::INTEGER, 0);
  EXCEPTION WHEN others THEN clean_years := 0; END;

  BEGIN
    clean_fee := coalesce(nullif(NEW.raw_user_meta_data->>'consultation_fee', '')::NUMERIC, 0);
  EXCEPTION WHEN others THEN clean_fee := 0; END;

  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (NEW.id, coalesce(nullif(NEW.raw_user_meta_data->>'full_name', ''), ''), NEW.raw_user_meta_data->>'phone', NEW.email)
  ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, email = EXCLUDED.email;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, clean_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  IF clean_role = 'patient' THEN
    INSERT INTO public.patients (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
    INSERT INTO public.patient_medical_info (patient_id) VALUES (NEW.id) ON CONFLICT (patient_id) DO NOTHING;
  END IF;

  IF clean_role = 'doctor' THEN
    INSERT INTO public.doctors (user_id, specialty, license_number, years_experience, consultation_fee, status, bio)
    VALUES (
      NEW.id,
      coalesce(nullif(NEW.raw_user_meta_data->>'specialty', ''), 'General Physician'),
      coalesce(nullif(NEW.raw_user_meta_data->>'license_number', ''), ''),
      clean_years,
      clean_fee,
      'pending',
      NEW.raw_user_meta_data->>'bio'
    ) ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 7) Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_medical_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_messages ENABLE ROW LEVEL SECURITY;

-- 8) Clean old policies to avoid duplicates
DO $$ DECLARE pol RECORD; BEGIN
  FOR pol IN SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- 9) Policies
CREATE POLICY "profiles select authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "roles select own or admin" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "patients select own doctor admin" ON public.patients FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "patients update own" ON public.patients FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "doctors select all" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "doctors update own or admin" ON public.doctors FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "appointments select participants admin" ON public.appointments FOR SELECT TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "appointments insert patient" ON public.appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "appointments update participants admin" ON public.appointments FOR UPDATE TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "prescriptions select participants admin" ON public.prescriptions FOR SELECT TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "prescriptions insert doctor" ON public.prescriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "payments select participants admin" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = patient_id OR auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "payments insert patient" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "payments update admin" ON public.payments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "messages select participants" ON public.messages FOR SELECT TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages insert sender" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "medical info patient owns" ON public.patient_medical_info FOR SELECT TO authenticated USING (
  auth.uid() = patient_id
  OR public.has_role(auth.uid(), 'admin')
  OR EXISTS (SELECT 1 FROM public.appointments a WHERE a.patient_id = patient_medical_info.patient_id AND a.doctor_id = auth.uid())
);
CREATE POLICY "medical info patient update" ON public.patient_medical_info FOR INSERT TO authenticated WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "medical info patient edit" ON public.patient_medical_info FOR UPDATE TO authenticated USING (auth.uid() = patient_id);

CREATE POLICY "doctor posts public read" ON public.doctor_posts FOR SELECT TO authenticated USING (status = 'published' OR public.has_role(auth.uid(), 'admin') OR auth.uid() = doctor_id);
CREATE POLICY "doctor posts create own" ON public.doctor_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "doctor posts update own admin" ON public.doctor_posts FOR UPDATE TO authenticated USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "doctor posts delete own admin" ON public.doctor_posts FOR DELETE TO authenticated USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "doctor reviews read" ON public.doctor_reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "doctor reviews insert completed patient" ON public.doctor_reviews FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = patient_id
  AND EXISTS (SELECT 1 FROM public.appointments a WHERE a.id = appointment_id AND a.patient_id = auth.uid() AND a.doctor_id = doctor_reviews.doctor_id AND a.status = 'completed')
);
CREATE POLICY "doctor reviews admin delete" ON public.doctor_reviews FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "partner messages doctor admin read" ON public.partner_messages FOR SELECT TO authenticated USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partner messages doctor create" ON public.partner_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "partner messages update doctor admin" ON public.partner_messages FOR UPDATE TO authenticated USING (auth.uid() = doctor_id OR public.has_role(auth.uid(), 'admin'));

-- 10) Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated, service_role;
