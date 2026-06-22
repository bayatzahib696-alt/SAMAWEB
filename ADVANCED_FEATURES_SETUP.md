# SAMA - Advanced MVP Setup

This ZIP adds the client-requested advanced features to the Lovable/Supabase project.

## New features added

### Patient side
- Patient allergies and medical information in **Patient → Medical Profile**
- Current medications, chronic conditions, medical notes, blood type, and emergency contact
- Improved doctor search with doctor banner, rating, city, languages, and online/offline status
- Professional doctor profile page with banner, photo, posts, ratings, reviews, availability, and booking
- Patients can rate doctors after a completed appointment

### Doctor side
- Doctor profile builder with banner, photo URL, education, languages, clinic/hospital, city, availability, online status
- Doctor posts / health education posts
- Care coordination request system for lab, pharmacy, clinic, admin, or another doctor
- Doctor can see patient allergies/medical information before writing prescription

### Admin side
- Admin dashboard includes doctor posts, reviews, and open care requests
- Admin can review/hide/delete doctor posts
- Admin can remove inappropriate reviews
- Admin can view and update care coordination requests

## New routes

Patient:
- `/patient/profile`
- `/patient/doctors`
- `/patient/doctors/$id`

Doctor:
- `/doctor/profile`
- `/doctor/posts`
- `/doctor/care-coordination`
- `/doctor/prescription/$id`

Admin:
- `/admin/posts`
- `/admin/reviews`
- `/admin/care-coordination`

## Supabase setup

Run this file in Supabase SQL Editor:

```text
supabase/manual/setup-advanced-features.sql
```

This file creates or updates:
- `profiles`
- `user_roles`
- `patients`
- `doctors`
- `appointments`
- `prescriptions`
- `payments`
- `messages`
- `patient_medical_info`
- `doctor_posts`
- `doctor_reviews`
- `partner_messages`

It also adds RLS policies and the signup trigger.

## Environment variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_KEY
```

Then restart the app:

```cmd
npm run dev
```

## Recommended test flow

1. Run SQL in Supabase.
2. Turn off email confirmation for testing: Supabase → Authentication → Providers → Email → Confirm email OFF.
3. Create a patient.
4. Create a doctor.
5. In Supabase, approve doctor by changing `doctors.status` to `approved`.
6. Patient fills allergies/medical information.
7. Doctor edits profile/banner in `/doctor/profile`.
8. Doctor creates posts in `/doctor/posts`.
9. Patient books appointment.
10. Doctor accepts and completes appointment.
11. Patient rates the doctor.
12. Doctor sends lab/pharmacy/admin request in `/doctor/care-coordination`.
13. Admin reviews posts/reviews/care requests.

## Important note

This is an MVP-ready feature build. Image fields use image URLs. Later, you can connect Supabase Storage for real image upload buttons.

