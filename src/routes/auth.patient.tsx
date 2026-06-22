import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";

export const Route = createFileRoute("/auth/patient")({
  component: () => <AuthCard role="patient" title="Patient Portal" subtitle="Book consultations and manage your care." />,
});
