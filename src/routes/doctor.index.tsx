import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { statusColor } from "@/lib/constants";
import { toast } from "sonner";
import { Video, FileText, Check, X, Calendar, Clock, ListChecks } from "lucide-react";

export const Route = createFileRoute("/doctor/")({
  component: DoctorDashboard,
});

function DoctorDashboard() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: doctor } = useQuery({
    queryKey: ["doctor-self", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("doctors").select("*").eq("user_id", user!.id).maybeSingle();
      return data;
    },
  });

  const { data: appts } = useQuery({
    queryKey: ["doc-appts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: a } = await supabase.from("appointments").select("*").eq("doctor_id", user!.id).order("appointment_date", { ascending: false });
      if (!a?.length) return [];
      const ids = [...new Set(a.map((x) => x.patient_id))];
      const { data: p } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const m = new Map((p ?? []).map((x) => [x.id, x]));
      return a.map((x) => ({ ...x, patient: m.get(x.patient_id) }));
    },
  });

  const today = new Date().toISOString().slice(0, 10);
  const todays = (appts ?? []).filter((a) => a.appointment_date === today);
  const pending = (appts ?? []).filter((a) => a.status === "pending");
  const confirmed = (appts ?? []).filter((a) => a.status === "confirmed");
  const completed = (appts ?? []).filter((a) => a.status === "completed");

  const setStatus = async (id: string, status: "pending" | "confirmed" | "rejected" | "completed") => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Appointment ${status}`);
    qc.invalidateQueries({ queryKey: ["doc-appts"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
        {doctor?.status === "pending" && (
          <div className="mt-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-sm">
            ⏳ Your account is pending admin approval. You won't appear in patient searches until approved.
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Today" value={todays.length} />
        <StatCard icon={Clock} label="Pending" value={pending.length} />
        <StatCard icon={Check} label="Confirmed" value={confirmed.length} />
        <StatCard icon={ListChecks} label="Completed" value={completed.length} />
      </div>

      <Section title="Pending requests" items={pending} actions={(a) => (
        <>
          <Button size="sm" onClick={() => setStatus(a.id, "confirmed")}><Check className="mr-1 h-4 w-4" /> Accept</Button>
          <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "rejected")}><X className="mr-1 h-4 w-4" /> Reject</Button>
        </>
      )} />

      <Section title="Confirmed appointments" items={confirmed} actions={(a) => (
        <>
          <Button asChild size="sm"><Link to="/video/$id" params={{ id: a.id }}><Video className="mr-1 h-4 w-4" /> Start</Link></Button>
          <Button asChild size="sm" variant="outline"><Link to="/doctor/prescription/$id" params={{ id: a.id }}><FileText className="mr-1 h-4 w-4" /> Prescribe</Link></Button>
        </>
      )} />

      <Section title="Completed appointments" items={completed} actions={(a) => (
        <Button asChild size="sm" variant="outline"><Link to="/prescription/$id" params={{ id: a.id }}><FileText className="mr-1 h-4 w-4" /> Summary</Link></Button>
      )} />
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <Card><CardContent className="flex items-center gap-3 p-5">
      <div className="grid h-11 w-11 place-items-center rounded-lg gradient-medical"><Icon className="h-5 w-5 text-primary-foreground" /></div>
      <div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
    </CardContent></Card>
  );
}

function Section({ title, items, actions }: { title: string; items: any[]; actions: (a: any) => React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        {items.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">No items.</p> : (
          <ul className="divide-y">
            {items.map((a) => (
              <li key={a.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium">{a.patient?.full_name || "Patient"}</div>
                  <div className="text-xs text-muted-foreground">{a.appointment_date} at {a.appointment_time?.toString().slice(0,5)} · <span className={`rounded px-1.5 ${statusColor[a.status]}`}>{a.status}</span></div>
                  {a.symptoms && <div className="mt-1 text-sm line-clamp-1">{a.symptoms}</div>}
                </div>
                <div className="flex gap-2">{actions(a)}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
