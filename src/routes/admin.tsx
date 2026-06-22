import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AppShell requiredRole="admin" title="" nav={[
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/doctors", label: "Doctor Approvals" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/appointments", label: "Appointments" },
      { to: "/admin/payments", label: "Payments" },
      { to: "/admin/posts", label: "Doctor Posts" },
      { to: "/admin/reviews", label: "Reviews" },
      { to: "/admin/care-coordination", label: "Care Requests" },
    ]}><Outlet /></AppShell>
  ),
});
