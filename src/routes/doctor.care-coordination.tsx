import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Building2, FlaskConical, Pill, Send, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/doctor/care-coordination")({
  component: CareCoordination,
});

const db = supabase as any;

type PartnerType = "lab" | "pharmacy" | "clinic" | "admin" | "other_doctor";
type RequestStatus = "sent" | "reviewed" | "completed";

function CareCoordination() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [patientId, setPatientId] = useState<string>("none");
  const [partnerType, setPartnerType] = useState<PartnerType>("lab");
  const [partnerName, setPartnerName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: appointments } = useQuery({
    queryKey: ["doctor-care-patients", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: appts } = await db.from("appointments").select("*").eq("doctor_id", user!.id).order("created_at", { ascending: false });
      const ids = [...new Set((appts ?? []).map((a: any) => a.patient_id))];
      if (!ids.length) return [];
      const { data: profiles } = await db.from("profiles").select("id, full_name, email").in("id", ids);
      const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    },
  });

  const { data: requests } = useQuery({
    queryKey: ["partner-messages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await db.from("partner_messages").select("*").eq("doctor_id", user!.id).order("created_at", { ascending: false });
      if (!data?.length) return [];
      const patientIds = [...new Set(data.map((r: any) => r.patient_id).filter(Boolean))];
      const { data: profiles } = patientIds.length ? await db.from("profiles").select("id, full_name").in("id", patientIds) : { data: [] };
      const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return data.map((r: any) => ({ ...r, patient: map.get(r.patient_id) }));
    },
  });

  const counts = useMemo(() => {
    const list = requests ?? [];
    return {
      sent: list.filter((r: any) => r.status === "sent").length,
      reviewed: list.filter((r: any) => r.status === "reviewed").length,
      completed: list.filter((r: any) => r.status === "completed").length,
    };
  }, [requests]);

  const createRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!message.trim()) return toast.error("Please write a message or request.");
    setSaving(true);
    const { error } = await db.from("partner_messages").insert({
      doctor_id: user.id,
      patient_id: patientId === "none" ? null : patientId,
      partner_type: partnerType,
      partner_name: partnerName || null,
      message,
      status: "sent",
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Care request sent");
    setPatientId("none");
    setPartnerName("");
    setMessage("");
    qc.invalidateQueries({ queryKey: ["partner-messages"] });
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await db.from("partner_messages").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Request updated");
    qc.invalidateQueries({ queryKey: ["partner-messages"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Care Coordination</h1>
        <p className="text-muted-foreground">Send internal requests to labs, pharmacies, clinics, admin, or another doctor. This is an MVP message system, not a real lab API yet.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={Send} label="Sent" value={counts.sent} />
        <Metric icon={Building2} label="Reviewed" value={counts.reviewed} />
        <Metric icon={Stethoscope} label="Completed" value={counts.completed} />
      </div>

      <Card>
        <CardHeader><CardTitle>New Request</CardTitle><CardDescription>Coordinate care with other healthcare partners.</CardDescription></CardHeader>
        <CardContent>
          <form onSubmit={createRequest} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Patient"><Select value={patientId} onValueChange={setPatientId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No patient / general</SelectItem>{appointments?.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>)}</SelectContent></Select></Field>
              <Field label="Partner type"><Select value={partnerType} onValueChange={(v) => setPartnerType(v as PartnerType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="lab">Lab</SelectItem><SelectItem value="pharmacy">Pharmacy</SelectItem><SelectItem value="clinic">Clinic</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="other_doctor">Other doctor</SelectItem></SelectContent></Select></Field>
              <Field label="Partner name"><Input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Lab name, pharmacy, clinic..." /></Field>
            </div>
            <Field label="Message / request"><Textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Example: Please prepare CBC lab test for this patient..." /></Field>
            <Button type="submit" disabled={saving}>{saving ? "Sending..." : "Send request"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Request History</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {requests?.length ? requests.map((request: any) => (
            <div key={request.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-semibold capitalize">{request.partner_type.replace("_", " ")} {request.partner_name ? `· ${request.partner_name}` : ""}</div>
                  <div className="text-xs text-muted-foreground">Patient: {request.patient?.full_name || "General"} · {new Date(request.created_at).toLocaleString()}</div>
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{request.message}</p>
                </div>
                <Select value={request.status} onValueChange={(v) => updateStatus(request.id, v as RequestStatus)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="sent">Sent</SelectItem><SelectItem value="reviewed">Reviewed</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">No care coordination requests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return <Card><CardContent className="flex items-center gap-3 p-5"><div className="grid h-11 w-11 place-items-center rounded-lg gradient-medical"><Icon className="h-5 w-5 text-primary-foreground" /></div><div><div className="text-2xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div></CardContent></Card>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}

