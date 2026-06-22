import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/patient")({
  component: () => (
    <AppShell
      requiredRole="patient"
      title=""
      nav={[
        { to: "/patient", label: "Dashboard" },
        { to: "/patient/doctors", label: "Find Doctor" },
        { to: "/patient/appointments", label: "Appointments" },
        { to: "/patient/prescriptions", label: "Prescriptions" },
        { to: "/patient/profile", label: "Medical Profile" },
      ]}
    >
      <Outlet />
    </AppShell>
  ),
});

