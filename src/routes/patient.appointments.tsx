import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { statusColor } from "@/lib/constants";
import { Video, FileText, Calendar } from "lucide-react";

export const Route = createFileRoute("/patient/appointments")({
  component: PatientAppointments,
});

function PatientAppointments() {
  const { user } = useAuth();
  const { data: appts } = useQuery({
    queryKey: ["patient-appts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: a } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", user!.id)
        .order("appointment_date", { ascending: false });
      if (!a?.length) return [];
      const ids = [...new Set(a.map((x) => x.doctor_id))];
      const { data: p } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const { data: docs } = await supabase.from("doctors").select("user_id, specialty").in("user_id", ids);
      const pm = new Map((p ?? []).map((x) => [x.id, x]));
      const dm = new Map((docs ?? []).map((x) => [x.user_id, x]));
      return a.map((x) => ({ ...x, doctor_profile: pm.get(x.doctor_id), doctor: dm.get(x.doctor_id) }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground">Track all your bookings.</p>
      </div>
      {!appts?.length ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No appointments yet.</p>
          <Button asChild className="mt-4"><Link to="/patient/doctors">Find a doctor</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {appts.map((a: any) => (
            <Card key={a.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold">Dr. {a.doctor_profile?.full_name || "—"}</div>
                    <span className="text-xs text-muted-foreground">{a.doctor?.specialty}</span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {a.appointment_date} at {a.appointment_time?.toString().slice(0, 5)}
                  </div>
                  {a.symptoms && <div className="mt-1 text-sm line-clamp-1">{a.symptoms}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusColor[a.status] || ""}`}>{a.status}</span>
                  {a.status === "confirmed" && (
                    <Button asChild size="sm"><Link to="/video/$id" params={{ id: a.id }}><Video className="mr-1 h-4 w-4" /> Join</Link></Button>
                  )}
                  {a.status === "completed" && (
                    <Button asChild size="sm" variant="outline"><Link to="/prescription/$id" params={{ id: a.id }}><FileText className="mr-1 h-4 w-4" /> Prescription</Link></Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

