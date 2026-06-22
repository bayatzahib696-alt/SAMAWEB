import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";

export const Route = createFileRoute("/auth/admin")({
  component: () => <AuthCard role="admin" title="Admin Portal" subtitle="Manage the platform." allowSignup={false} />,
});
