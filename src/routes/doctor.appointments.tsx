import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/doctor/appointments")({
  beforeLoad: () => { throw redirect({ to: "/doctor" }); },
});
