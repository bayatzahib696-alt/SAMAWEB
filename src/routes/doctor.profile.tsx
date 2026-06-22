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
import { SPECIALTIES } from "@/lib/constants";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Image, Stethoscope, UserRound } from "lucide-react";

export const Route = createFileRoute("/doctor/profile")({
  component: DoctorProfileEditor,
});

const db = supabase as any;

function DoctorProfileEditor() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [bio, setBio] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [education, setEducation] = useState("");
  const [languages, setLanguages] = useState("Dari, Pashto");
  const [clinicName, setClinicName] = useState("");
  const [city, setCity] = useState("");
  const [availability, setAvailability] = useState("09:00, 10:30, 12:00, 14:00");
  const [isOnline, setIsOnline] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["doctor-profile-editor", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: prof } = await db.from("profiles").select("*").eq("id", user!.id).maybeSingle();
      const { data: doc } = await db.from("doctors").select("*").eq("user_id", user!.id).maybeSingle();
      return { prof, doc };
    },
  });

  useEffect(() => {
    if (data?.prof) {
      setFullName(data.prof.full_name || "");
      setPhone(data.prof.phone || "");
    }
    if (data?.doc) {
      setSpecialty(data.doc.specialty || SPECIALTIES[0]);
      setLicenseNumber(data.doc.license_number || "");
      setYearsExperience(String(data.doc.years_experience ?? ""));
      setConsultationFee(String(data.doc.consultation_fee ?? ""));
      setBio(data.doc.bio || "");
      setBannerUrl(data.doc.banner_url || "");
      setProfilePhotoUrl(data.doc.profile_photo_url || "");
      setEducation(data.doc.education || "");
      setLanguages(Array.isArray(data.doc.languages) ? data.doc.languages.join(", ") : (data.doc.languages || ""));
      setClinicName(data.doc.clinic_name || "");
      setCity(data.doc.city || "");
      setAvailability(data.doc.availability || "09:00, 10:30, 12:00, 14:00");
      setIsOnline(Boolean(data.doc.is_online));
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
    const languageArray = languages.split(",").map((l) => l.trim()).filter(Boolean);
    const { error } = await db.from("doctors").upsert({
      user_id: user.id,
      specialty,
      license_number: licenseNumber,
      years_experience: Number(yearsExperience) || 0,
      consultation_fee: Number(consultationFee) || 0,
      bio: bio || null,
      banner_url: bannerUrl || null,
      profile_photo_url: profilePhotoUrl || null,
      education: education || null,
      languages: languageArray.length ? languageArray : ["Dari"],
      clinic_name: clinicName || null,
      city: city || null,
      availability: availability || null,
      is_online: isOnline,
    }, { onConflict: "user_id" });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Doctor profile updated");
    qc.invalidateQueries({ queryKey: ["doctor-profile-editor"] });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Profile Builder</h1>
        <p className="text-muted-foreground">Create the professional banner/profile patients will see before booking.</p>
      </div>
      <form onSubmit={save} className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <UserRound className="mt-1 h-5 w-5 text-primary" />
            <div><CardTitle>Basic Information</CardTitle><CardDescription>Your public doctor identity.</CardDescription></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></Field>
              <Field label="Phone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
              <Field label="Specialty"><Select value={specialty} onValueChange={setSpecialty}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></Field>
              <Field label="License number"><Input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} /></Field>
              <Field label="Years of experience"><Input type="number" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} /></Field>
              <Field label="Consultation fee (AFN)"><Input type="number" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} /></Field>
            </div>
            <Field label="Bio"><Textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short professional biography" /></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <Image className="mt-1 h-5 w-5 text-primary" />
            <div><CardTitle>Banner and Profile Design</CardTitle><CardDescription>Add image URLs now. Later you can connect Supabase Storage for uploads.</CardDescription></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Banner image URL"><Input value={bannerUrl} onChange={(e) => setBannerUrl(e.target.value)} placeholder="https://..." /></Field>
              <Field label="Profile photo URL"><Input value={profilePhotoUrl} onChange={(e) => setProfilePhotoUrl(e.target.value)} placeholder="https://..." /></Field>
            </div>
            <div className="overflow-hidden rounded-xl border">
              <div className="h-32 bg-gradient-to-r from-primary to-accent">{bannerUrl && <img src={bannerUrl} className="h-full w-full object-cover" />}</div>
              <div className="flex items-end gap-3 p-4 pt-0">
                <div className="-mt-10 grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border-4 border-background gradient-medical text-2xl font-bold text-primary-foreground">
                  {profilePhotoUrl ? <img src={profilePhotoUrl} className="h-full w-full object-cover" /> : (fullName || "D").charAt(0)}
                </div>
                <div className="pb-1"><div className="font-semibold">Dr. {fullName || "Your Name"}</div><div className="text-sm text-muted-foreground">{specialty}</div></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start gap-3">
            <Stethoscope className="mt-1 h-5 w-5 text-primary" />
            <div><CardTitle>Practice Details</CardTitle><CardDescription>Help patients choose the right doctor.</CardDescription></div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Field label="Education"><Input value={education} onChange={(e) => setEducation(e.target.value)} placeholder="MD, Kabul Medical University..." /></Field>
            <Field label="Languages"><Input value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="Dari, Pashto, English" /></Field>
            <Field label="Clinic / Hospital name"><Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} /></Field>
            <Field label="City / Province"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
            <Field label="Availability slots"><Input value={availability} onChange={(e) => setAvailability(e.target.value)} placeholder="09:00, 10:30, 14:00" /></Field>
            <Field label="Online status"><Select value={isOnline ? "online" : "offline"} onValueChange={(v) => setIsOnline(v === "online")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="online">Online</SelectItem><SelectItem value="offline">Offline</SelectItem></SelectContent></Select></Field>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save doctor profile"}</Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
