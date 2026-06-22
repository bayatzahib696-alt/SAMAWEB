import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Printer } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/prescription/$id")({
  component: PrescriptionPage,
});

function PrescriptionPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!loading && !user) navigate({ to: "/" }); }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["rx", id],
    enabled: !!user,
    queryFn: async () => {
      const { data: rx } = await supabase.from("prescriptions").select("*").eq("appointment_id", id).maybeSingle();
      const { data: appt } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();
      if (!appt) return null;
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", [appt.patient_id, appt.doctor_id]);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return { rx, appt, doctor: m.get(appt.doctor_id), patient: m.get(appt.patient_id) };
    },
  });

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!data?.rx) return (
    <div className="mx-auto max-w-2xl p-8 text-center">
      <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
      <p className="mt-3 text-muted-foreground">No prescription has been written yet for this appointment.</p>
      <Button asChild variant="ghost" className="mt-4"><Link to="/">Back</Link></Button>
    </div>
  );

  const { rx, appt, doctor, patient } = data;

  return (
    <div className="min-h-screen bg-secondary/40 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => history.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Visit Summary & Prescription</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">SAMA</p>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>Date: {new Date(rx.created_at).toLocaleDateString()}</div>
                <div>Visit: {appt.appointment_date}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Block label="Patient" value={patient?.full_name || "—"} />
              <Block label="Doctor" value={`Dr. ${doctor?.full_name || "—"}`} />
            </div>
            <Block label="Diagnosis" value={rx.diagnosis} />
            <Block label="Prescription / Medicine" value={rx.medicine} />
            {rx.instructions && <Block label="Instructions" value={rx.instructions} />}
            {rx.follow_up_notes && <Block label="Follow-up notes" value={rx.follow_up_notes} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{value}</div>
    </div>
  );
}

