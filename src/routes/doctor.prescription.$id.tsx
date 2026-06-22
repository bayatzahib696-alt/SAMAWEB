import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AlertTriangle, ArrowLeft, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/doctor/prescription/$id")({
  component: WriteRx,
});

const db = supabase as any;

function WriteRx() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState("");
  const [medicine, setMedicine] = useState("");
  const [instructions, setInstructions] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: appt } = useQuery({
    queryKey: ["appt-rx", id],
    enabled: !!user,
    queryFn: async () => {
      const { data: a } = await db.from("appointments").select("*").eq("id", id).maybeSingle();
      if (!a) return null;
      const { data: p } = await db.from("profiles").select("full_name").eq("id", a.patient_id).maybeSingle();
      const { data: med } = await db.from("patient_medical_info").select("*").eq("patient_id", a.patient_id).maybeSingle();
      return { ...a, patient: p, medical: med };
    },
  });

  useEffect(() => {
    if (!user) return;
    db.from("prescriptions").select("*").eq("appointment_id", id).maybeSingle().then(({ data }) => {
      if (data) {
        setDiagnosis(data.diagnosis); setMedicine(data.medicine);
        setInstructions(data.instructions || ""); setFollowUp(data.follow_up_notes || "");
      }
    });
  }, [id, user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !appt) return;
    setSaving(true);
    const { error } = await db.from("prescriptions").insert({
      appointment_id: appt.id,
      doctor_id: user.id,
      patient_id: appt.patient_id,
      diagnosis, medicine,
      instructions: instructions || null,
      follow_up_notes: followUp || null,
    });
    if (error) { setSaving(false); return toast.error(error.message); }
    await db.from("appointments").update({ status: "completed" }).eq("id", appt.id);
    await db.from("payments").update({ status: "paid" }).eq("appointment_id", appt.id);
    setSaving(false);
    toast.success("Prescription submitted. Appointment marked completed.");
    navigate({ to: "/doctor" });
  };

  return (
    <AppShell requiredRole="doctor" title="" nav={[{ to: "/doctor", label: "Dashboard" }]}>
      <div className="mx-auto max-w-2xl">
        <Link to="/doctor" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back</Link>
        <h1 className="mb-1 text-3xl font-bold tracking-tight">Write Prescription</h1>
        <p className="mb-6 text-sm text-muted-foreground">Patient: {appt?.patient?.full_name || "—"} · {appt?.appointment_date}</p>
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 text-warning" />
            <div>
              <CardTitle>Patient Allergies and Medical Info</CardTitle>
              <CardDescription>Review before prescribing medicine.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Medical label="Allergies" value={appt?.medical?.allergies} urgent />
            <Medical label="Current medications" value={appt?.medical?.current_medications} />
            <Medical label="Chronic conditions" value={appt?.medical?.chronic_conditions} />
            <Medical label="Medical notes" value={appt?.medical?.medical_notes} />
          </CardContent>
        </Card>

        <Card><CardHeader><CardTitle>Visit Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5"><Label>Diagnosis</Label><Input required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Prescription medicine</Label><Textarea rows={3} required value={medicine} onChange={(e) => setMedicine(e.target.value)} placeholder="e.g. Amoxicillin 500mg — 1 tablet 3x/day for 5 days" /></div>
            <div className="space-y-1.5"><Label>Instructions</Label><Textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Follow-up notes</Label><Textarea rows={2} value={followUp} onChange={(e) => setFollowUp(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={saving}>{saving ? "Submitting..." : "Submit prescription"}</Button>
          </form>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}

function Medical({ label, value, urgent = false }: { label: string; value?: string | null; urgent?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${urgent && value ? "border-warning/40 bg-warning/10" : "bg-background"}`}>
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <HeartPulse className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="text-sm">{value || "Not added"}</div>
    </div>
  );
}

