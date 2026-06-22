import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";

export const Route = createFileRoute("/auth/doctor")({
  component: () => <AuthCard role="doctor" title="Doctor Portal" subtitle="Manage appointments and see your patients." />,
});
