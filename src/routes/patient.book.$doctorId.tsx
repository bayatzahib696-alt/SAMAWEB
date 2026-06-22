import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { fmtAFN } from "@/lib/constants";

export const Route = createFileRoute("/patient/book/$doctorId")({
  component: BookAppointment,
});

const SLOTS = ["09:00", "10:00", "10:30", "11:00", "12:00", "14:00", "14:30", "15:00", "16:00", "17:00"];

function BookAppointment() {
  const { doctorId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState<string>(SLOTS[0]);
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: doctor } = useQuery({
    queryKey: ["doctor-book", doctorId],
    queryFn: async () => {
      const { data: d } = await supabase.from("doctors").select("*").eq("id", doctorId).maybeSingle();
      if (!d) return null;
      const { data: p } = await supabase.from("profiles").select("full_name").eq("id", d.user_id).maybeSingle();
      return { ...d, profile: p };
    },
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !doctor) return;
    setLoading(true);
    const { data: appt, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: user.id,
        doctor_id: doctor.user_id,
        appointment_date: date,
        appointment_time: time,
        symptoms,
        status: "pending",
      })
      .select()
      .single();
    if (error) { setLoading(false); return toast.error(error.message); }
    await supabase.from("payments").insert({
      appointment_id: appt.id,
      patient_id: user.id,
      doctor_id: doctor.user_id,
      amount: doctor.consultation_fee,
      currency: "AFN",
      status: "unpaid",
      payment_method: "cash",
    });
    setLoading(false);
    toast.success("Appointment requested! Status: Pending");
    navigate({ to: "/patient/appointments" });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-3xl font-bold tracking-tight">Book Appointment</h1>
      <p className="mb-6 text-muted-foreground">Submit your request — the doctor will confirm shortly.</p>

      <Card>
        <CardHeader>
          <CardTitle>{doctor ? `Dr. ${doctor.profile?.full_name} • ${doctor.specialty}` : "Loading..."}</CardTitle>
          {doctor && <p className="text-sm text-muted-foreground">Fee: {fmtAFN(doctor.consultation_fee)}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input type="date" required value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Time</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SLOTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Reason for visit / symptoms</Label>
              <Textarea rows={4} value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Describe what you'd like to discuss..." />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !doctor}>
              {loading ? "Submitting..." : "Submit Appointment Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

