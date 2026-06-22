import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { A as AppShell } from "./app-shell-7Zv_J3M_.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as Route } from "./router-Dtls9AFd.mjs";
import { A as ArrowLeft, T as TriangleAlert, H as HeartPulse } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
const db = supabase;
function WriteRx() {
  const {
    id
  } = Route.useParams();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = reactExports.useState("");
  const [medicine, setMedicine] = reactExports.useState("");
  const [instructions, setInstructions] = reactExports.useState("");
  const [followUp, setFollowUp] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const {
    data: appt
  } = useQuery({
    queryKey: ["appt-rx", id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: a
      } = await db.from("appointments").select("*").eq("id", id).maybeSingle();
      if (!a) return null;
      const {
        data: p
      } = await db.from("profiles").select("full_name").eq("id", a.patient_id).maybeSingle();
      const {
        data: med
      } = await db.from("patient_medical_info").select("*").eq("patient_id", a.patient_id).maybeSingle();
      return {
        ...a,
        patient: p,
        medical: med
      };
    }
  });
  reactExports.useEffect(() => {
    if (!user) return;
    db.from("prescriptions").select("*").eq("appointment_id", id).maybeSingle().then(({
      data
    }) => {
      if (data) {
        setDiagnosis(data.diagnosis);
        setMedicine(data.medicine);
        setInstructions(data.instructions || "");
        setFollowUp(data.follow_up_notes || "");
      }
    });
  }, [id, user]);
  const submit = async (e) => {
    e.preventDefault();
    if (!user || !appt) return;
    setSaving(true);
    const {
      error
    } = await db.from("prescriptions").insert({
      appointment_id: appt.id,
      doctor_id: user.id,
      patient_id: appt.patient_id,
      diagnosis,
      medicine,
      instructions: instructions || null,
      follow_up_notes: followUp || null
    });
    if (error) {
      setSaving(false);
      return toast.error(error.message);
    }
    await db.from("appointments").update({
      status: "completed"
    }).eq("id", appt.id);
    await db.from("payments").update({
      status: "paid"
    }).eq("appointment_id", appt.id);
    setSaving(false);
    toast.success("Prescription submitted. Appointment marked completed.");
    navigate({
      to: "/doctor"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { requiredRole: "doctor", title: "", nav: [{
    to: "/doctor",
    label: "Dashboard"
  }], children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/doctor", className: "mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-1 text-3xl font-bold tracking-tight", children: "Write Prescription" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-6 text-sm text-muted-foreground", children: [
      "Patient: ",
      appt?.patient?.full_name || "—",
      " · ",
      appt?.appointment_date
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-1 h-5 w-5 text-warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Patient Allergies and Medical Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Review before prescribing medicine." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-3 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Medical, { label: "Allergies", value: appt?.medical?.allergies, urgent: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Medical, { label: "Current medications", value: appt?.medical?.current_medications }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Medical, { label: "Chronic conditions", value: appt?.medical?.chronic_conditions }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Medical, { label: "Medical notes", value: appt?.medical?.medical_notes })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Visit Details" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Diagnosis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: diagnosis, onChange: (e) => setDiagnosis(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Prescription medicine" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, required: true, value: medicine, onChange: (e) => setMedicine(e.target.value), placeholder: "e.g. Amoxicillin 500mg — 1 tablet 3x/day for 5 days" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Instructions" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: instructions, onChange: (e) => setInstructions(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Follow-up notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, value: followUp, onChange: (e) => setFollowUp(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: saving, children: saving ? "Submitting..." : "Submit prescription" })
      ] }) })
    ] })
  ] }) });
}
function Medical({
  label,
  value,
  urgent = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-xl border p-3 ${urgent && value ? "border-warning/40 bg-warning/10" : "bg-background"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "h-3.5 w-3.5" }),
      " ",
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm", children: value || "Not added" })
  ] });
}
export {
  WriteRx as component
};
