import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as UserRound, T as TriangleAlert, H as HeartPulse } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
const db = supabase;
function PatientProfile() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [dob, setDob] = reactExports.useState("");
  const [gender, setGender] = reactExports.useState("");
  const [address, setAddress] = reactExports.useState("");
  const [allergies, setAllergies] = reactExports.useState("");
  const [currentMedications, setCurrentMedications] = reactExports.useState("");
  const [chronicConditions, setChronicConditions] = reactExports.useState("");
  const [medicalNotes, setMedicalNotes] = reactExports.useState("");
  const [bloodType, setBloodType] = reactExports.useState("");
  const [emergencyContact, setEmergencyContact] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const {
    data
  } = useQuery({
    queryKey: ["my-profile-advanced", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: prof
      } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const {
        data: pat
      } = await db.from("patients").select("*").eq("user_id", user.id).maybeSingle();
      const {
        data: med
      } = await db.from("patient_medical_info").select("*").eq("patient_id", user.id).maybeSingle();
      return {
        prof,
        pat,
        med
      };
    }
  });
  reactExports.useEffect(() => {
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
  const save = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const {
      error: profileError
    } = await db.from("profiles").update({
      full_name: fullName,
      phone
    }).eq("id", user.id);
    if (profileError) {
      setSaving(false);
      return toast.error(profileError.message);
    }
    const {
      error: patientError
    } = await db.from("patients").upsert({
      user_id: user.id,
      date_of_birth: dob || null,
      gender: gender || null,
      address: address || null
    }, {
      onConflict: "user_id"
    });
    if (patientError) {
      setSaving(false);
      return toast.error(patientError.message);
    }
    const {
      error: medError
    } = await db.from("patient_medical_info").upsert({
      patient_id: user.id,
      allergies: allergies || null,
      current_medications: currentMedications || null,
      chronic_conditions: chronicConditions || null,
      medical_notes: medicalNotes || null,
      blood_type: bloodType || null,
      emergency_contact: emergencyContact || null,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }, {
      onConflict: "patient_id"
    });
    setSaving(false);
    if (medError) return toast.error(medError.message);
    toast.success("Medical profile updated");
    qc.invalidateQueries({
      queryKey: ["my-profile-advanced"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Patient Medical Profile" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Doctors can use this information to make safer decisions before prescriptions." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "mt-1 h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Personal Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Basic patient information and contact details." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: user?.email || "", disabled: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Date of birth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dob, onChange: (e) => setDob(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Gender", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: gender, onChange: (e) => setGender(e.target.value), placeholder: "Male / Female / Other" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Address", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: address, onChange: (e) => setAddress(e.target.value) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-1 h-5 w-5 text-warning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Allergies and Safety Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "This is one of the most important safety fields for doctors before prescribing medicine." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Allergies", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: allergies, onChange: (e) => setAllergies(e.target.value), placeholder: "Example: Penicillin, peanuts, aspirin..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Current medications", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: currentMedications, onChange: (e) => setCurrentMedications(e.target.value), placeholder: "Medicines the patient currently takes" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Chronic conditions", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: chronicConditions, onChange: (e) => setChronicConditions(e.target.value), placeholder: "Diabetes, hypertension, asthma..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Medical notes", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: medicalNotes, onChange: (e) => setMedicalNotes(e.target.value), placeholder: "Any other important medical note" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "mt-1 h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Emergency Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Optional information for urgent situations." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Blood type", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: bloodType, onChange: (e) => setBloodType(e.target.value), placeholder: "A+, B-, O+..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Emergency contact", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: emergencyContact, onChange: (e) => setEmergencyContact(e.target.value), placeholder: "Name and phone number" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, children: saving ? "Saving..." : "Save medical profile" })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    children
  ] });
}
export {
  PatientProfile as component
};
