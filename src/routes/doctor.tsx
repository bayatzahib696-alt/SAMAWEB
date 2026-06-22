import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/doctor")({
  component: () => (
    <AppShell
      requiredRole="doctor"
      title=""
      nav={[
        { to: "/doctor", label: "Dashboard" },
        { to: "/doctor/appointments", label: "Appointments" },
        { to: "/doctor/profile", label: "My Profile" },
        { to: "/doctor/posts", label: "Posts" },
        { to: "/doctor/care-coordination", label: "Care Requests" },
      ]}
    >
      <Outlet />
    </AppShell>
  ),
});

