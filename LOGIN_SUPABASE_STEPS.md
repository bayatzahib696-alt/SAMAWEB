# Make Login and Sign Up Work with Supabase

## 1) Add env variables
Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Get these from Supabase Dashboard -> Project Settings -> API.

## 2) Run the SQL setup
Open Supabase Dashboard -> SQL Editor -> New Query.
Paste and run the SQL file:

`supabase/manual/setup-auth-working.sql`

This creates the tables, role policies, and trigger so signup creates:
- `profiles`
- `user_roles`
- `patients` for patient signup
- `doctors` for doctor signup

## 3) Disable email confirmation for testing
Supabase Dashboard -> Authentication -> Providers -> Email -> turn off Confirm email.
This lets you log in immediately after signup during MVP testing.

## 4) Restart app
```bash
npm run dev
```

## 5) Test patient signup
Go to `/auth/patient`, create account, then check:
- Supabase -> Authentication -> Users
- Supabase -> Table Editor -> profiles
- Supabase -> Table Editor -> user_roles
- Supabase -> Table Editor -> patients

## 6) Test doctor signup
Go to `/auth/doctor`, create doctor account, then check:
- Table Editor -> doctors

The doctor will be `pending`. To show the doctor in patient search, change status to `approved` manually or from admin panel.

## 7) Create admin login
Create a user manually in Supabase Dashboard -> Authentication -> Users.
Then run this SQL after replacing the email:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'YOUR_ADMIN_EMAIL@example.com'
on conflict (user_id, role) do nothing;
```

Then log in from `/auth/admin`.

