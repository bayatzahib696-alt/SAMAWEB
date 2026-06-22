import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, FileText, User, Stethoscope } from "lucide-react";
import { statusColor } from "@/lib/constants";

export const Route = createFileRoute("/patient/")({
  component: PatientDashboard,
});

function PatientDashboard() {
  const { user } = useAuth();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      return data;
    },
  });
  const { data: appts } = useQuery({
    queryKey: ["my-appts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", user!.id)
        .order("appointment_date", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border bg-card p-8">
        <h2 className="text-2xl font-bold">Welcome back, {profile?.full_name || "friend"} 👋</h2>
        <p className="mt-1 text-muted-foreground">Here's a quick overview of your care.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink to="/patient/doctors" icon={Search} label="Find Doctor" />
          <QuickLink to="/patient/appointments" icon={Calendar} label="My Appointments" />
          <QuickLink to="/patient/prescriptions" icon={FileText} label="Prescriptions" />
          <QuickLink to="/patient/profile" icon={User} label="Profile" />
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent appointments</CardTitle>
          <Button asChild variant="ghost" size="sm"><Link to="/patient/appointments">View all</Link></Button>
        </CardHeader>
        <CardContent>
          {!appts?.length ? (
            <div className="rounded-xl border border-dashed p-8 text-center">
              <Stethoscope className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">No appointments yet.</p>
              <Button asChild className="mt-4"><Link to="/patient/doctors">Find a doctor</Link></Button>
            </div>
          ) : (
            <ul className="divide-y">
              {appts.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium">{a.appointment_date} at {a.appointment_time?.toString().slice(0, 5)}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{a.symptoms || "—"}</div>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[a.status] || ""}`}>{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLink({ to, icon: Icon, label }: { to: string; icon: typeof Search; label: string }) {
  return (
    <Link to={to} className="group flex items-center gap-3 rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-sm">
      <div className="grid h-10 w-10 place-items-center rounded-lg gradient-medical">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );
}

