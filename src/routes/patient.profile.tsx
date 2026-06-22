import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, HeartPulse, UserRound } from "lucide-react";

export const Route = createFileRoute("/patient/profile")({
  component: PatientProfile,
});

const db = supabase as any;

function PatientProfile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [chronicConditions, setChronicConditions] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["my-profile-advanced", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: prof } = await db.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      const { data: pat } = await db.from("patients").select("*").eq("user_id", user!.id).maybeSingle();
      const { data: med } = await db.from("patient_medical_info").select("*").eq("patient_id", user!.id).maybeSingle();
      return { prof, pat, med };
    },
  });

  useEffect(() => {
    if (data?.prof) {
      setFullName(data.prof.full_name || "");
      setPhone(data.prof.phone || "");
    }
    if (data?.pat) {
      setDob(data.pat.date_of_birth || "");
      setGender(data.pat.gender || "");
      setAddress(data.pat.address || "");
    }
    if (data?.med) {
      setAllergies(data.med.allergies || "");
      setCurrentMedications(data.med.current_medications || "");
      setChronicConditions(data.med.chronic_conditions || "");
      setMedicalNotes(data.med.medical_notes || "");
      setBloodType(data.med.blood_type || "");
      setEmergencyContact(data.med.emergency_contact || "");
    }
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error: profileError } = await db.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
    if (profileError) {
      setSaving(false);
      return toast.error(profileError.message);
    }

    const { error: patientError } = await db.from("patients").upsert({
      user_id: user.id,
      date_of_birth: dob || null,
      gender: gender || null,
      address: address || null,
    }, { onConflict: "user_id" });
    if (patientError) {
      setSaving(false);
      return toast.error(patientError.message);
    }

    const { error: medError } = await db.from("patient_medical_info").upsert({
      patient_id: user.id,
      allergies: allergies || null,
      current_medications: currentMedications || null,
      chronic_conditions: chronicConditions || null,
      medical_notes: medicalNotes || null,
      blood_type: bloodType || null,
      emergency_contact: emergencyContact || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "patient_id" });

    setSaving(false);
    if (medError) return toast.error(medError.message);
    toast.success("Medical profile updated");
    qc.invalidateQueries({ queryKey: ["my-profile-advanced"] });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Patient Medical Profile</h1>
        <p className="text-muted-foreground">Doctors can use this information to make safer decisions before prescriptions.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <UserRound className="mt-1 h-5 w-5 text-primary" />
            <div>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic patient information and contact details.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
              <Field label="Email"><Input value={user?.email || ""} disabled /></Field>
              <Field label="Date of birth"><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></Field>
              <Field label="Gender"><Input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male / Female / Other" /></Field>
            </div>
            <Field label="Address"><Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 text-warning" />
            <div>
              <CardTitle>Allergies and Safety Notes</CardTitle>
              <CardDescription>This is one of the most important safety fields for doctors before prescribing medicine.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Allergies"><Textarea rows={4} value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Example: Penicillin, peanuts, aspirin..." /></Field>
            <Field label="Current medications"><Textarea rows={4} value={currentMedications} onChange={(e) => setCurrentMedications(e.target.value)} placeholder="Medicines the patient currently takes" /></Field>
            <Field label="Chronic conditions"><Textarea rows={4} value={chronicConditions} onChange={(e) => setChronicConditions(e.target.value)} placeholder="Diabetes, hypertension, asthma..." /></Field>
            <Field label="Medical notes"><Textarea rows={4} value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} placeholder="Any other important medical note" /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <HeartPulse className="mt-1 h-5 w-5 text-primary" />
            <div>
              <CardTitle>Emergency Information</CardTitle>
              <CardDescription>Optional information for urgent situations.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Blood type"><Input value={bloodType} onChange={(e) => setBloodType(e.target.value)} placeholder="A+, B-, O+..." /></Field>
            <Field label="Emergency contact"><Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Name and phone number" /></Field>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save medical profile"}</Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
