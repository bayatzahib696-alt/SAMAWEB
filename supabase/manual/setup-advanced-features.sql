-- SAMA professional feature database
-- Run in Supabase SQL Editor

create table if not exists public.specialties (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into public.specialties (name, description)
values
  ('General Physician', 'General health consultation and primary care'),
  ('Pediatrician', 'Child and family healthcare'),
  ('Cardiologist', 'Heart and blood pressure care'),
  ('Dermatologist', 'Skin, hair, and nail care'),
  ('Gynecologist', 'Women health services'),
  ('Dentist', 'Dental and oral health services')
on conflict (name) do nothing;

create table if not exists public.doctor_availability_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null,
  day_of_week text not null,
  start_time time not null,
  end_time time not null,
  slot_type text default 'online',
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.patient_medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  doctor_id uuid,
  medication_name text not null,
  dosage text,
  frequency text,
  start_date date,
  end_date date,
  instructions text,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.treatment_plans (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  doctor_id uuid,
  title text not null,
  diagnosis text,
  plan_notes text,
  follow_up_date date,
  status text default 'active',
  created_at timestamptz default now()
);

create table if not exists public.lab_requests (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  doctor_id uuid,
  appointment_id uuid,
  test_name text not null,
  notes text,
  status text default 'requested',
  result_url text,
  created_at timestamptz default now()
);

create table if not exists public.care_coordination_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  created_by uuid,
  note_type text default 'general',
  note text not null,
  priority text default 'normal',
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists public.doctor_reviews (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid not null,
  patient_id uuid,
  appointment_id uuid,
  rating int check (rating between 1 and 5),
  review_text text,
  is_public boolean default true,
  created_at timestamptz default now()
);

do $$
begin
  if to_regclass('public.doctors') is not null then
    alter table public.doctors add column if not exists city text;
    alter table public.doctors add column if not exists province text;
    alter table public.doctors add column if not exists consultation_fee numeric;
    alter table public.doctors add column if not exists years_experience int;
    alter table public.doctors add column if not exists languages text[];
    alter table public.doctors add column if not exists profile_summary text;
    alter table public.doctors add column if not exists is_featured boolean default false;
    alter table public.doctors add column if not exists average_rating numeric default 0;
    alter table public.doctors add column if not exists review_count int default 0;
  end if;
end $$;

alter table public.specialties enable row level security;
alter table public.doctor_availability_slots enable row level security;
alter table public.patient_medications enable row level security;
alter table public.treatment_plans enable row level security;
alter table public.lab_requests enable row level security;
alter table public.care_coordination_notes enable row level security;
alter table public.doctor_reviews enable row level security;

drop policy if exists "public can read specialties" on public.specialties;
create policy "public can read specialties"
on public.specialties
for select
to anon, authenticated
using (true);

drop policy if exists "public can read doctor reviews" on public.doctor_reviews;
create policy "public can read doctor reviews"
on public.doctor_reviews
for select
to anon, authenticated
using (is_public = true);

drop policy if exists "authenticated can insert doctor reviews" on public.doctor_reviews;
create policy "authenticated can insert doctor reviews"
on public.doctor_reviews
for insert
to authenticated
with check (true);

drop policy if exists "authenticated can manage medications" on public.patient_medications;
create policy "authenticated can manage medications"
on public.patient_medications
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can manage treatment plans" on public.treatment_plans;
create policy "authenticated can manage treatment plans"
on public.treatment_plans
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can manage lab requests" on public.lab_requests;
create policy "authenticated can manage lab requests"
on public.lab_requests
for all
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated can manage care notes" on public.care_coordination_notes;
create policy "authenticated can manage care notes"
on public.care_coordination_notes
for all
to authenticated
using (true)
with check (true);