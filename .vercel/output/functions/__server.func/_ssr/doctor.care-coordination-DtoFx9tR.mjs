import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as Send, B as Building2, S as Stethoscope } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const db = supabase;
function CareCoordination() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [patientId, setPatientId] = reactExports.useState("none");
  const [partnerType, setPartnerType] = reactExports.useState("lab");
  const [partnerName, setPartnerName] = reactExports.useState("");
  const [message, setMessage] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const {
    data: appointments
  } = useQuery({
    queryKey: ["doctor-care-patients", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: appts
      } = await db.from("appointments").select("*").eq("doctor_id", user.id).order("created_at", {
        ascending: false
      });
      const ids = [...new Set((appts ?? []).map((a) => a.patient_id))];
      if (!ids.length) return [];
      const {
        data: profiles
      } = await db.from("profiles").select("id, full_name, email").in("id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    }
  });
  const {
    data: requests
  } = useQuery({
    queryKey: ["partner-messages", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await db.from("partner_messages").select("*").eq("doctor_id", user.id).order("created_at", {
        ascending: false
      });
      if (!data?.length) return [];
      const patientIds = [...new Set(data.map((r) => r.patient_id).filter(Boolean))];
      const {
        data: profiles
      } = patientIds.length ? await db.from("profiles").select("id, full_name").in("id", patientIds) : {
        data: []
      };
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return data.map((r) => ({
        ...r,
        patient: map.get(r.patient_id)
      }));
    }
  });
  const counts = reactExports.useMemo(() => {
    const list = requests ?? [];
    return {
      sent: list.filter((r) => r.status === "sent").length,
      reviewed: list.filter((r) => r.status === "reviewed").length,
      completed: list.filter((r) => r.status === "completed").length
    };
  }, [requests]);
  const createRequest = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!message.trim()) return toast.error("Please write a message or request.");
    setSaving(true);
    const {
      error
    } = await db.from("partner_messages").insert({
      doctor_id: user.id,
      patient_id: patientId === "none" ? null : patientId,
      partner_type: partnerType,
      partner_name: partnerName || null,
      message,
      status: "sent"
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Care request sent");
    setPatientId("none");
    setPartnerName("");
    setMessage("");
    qc.invalidateQueries({
      queryKey: ["partner-messages"]
    });
  };
  const updateStatus = async (id, status) => {
    const {
      error
    } = await db.from("partner_messages").update({
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Request updated");
    qc.invalidateQueries({
      queryKey: ["partner-messages"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Care Coordination" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Send internal requests to labs, pharmacies, clinics, admin, or another doctor. This is an MVP message system, not a real lab API yet." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { icon: Send, label: "Sent", value: counts.sent }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { icon: Building2, label: "Reviewed", value: counts.reviewed }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Metric, { icon: Stethoscope, label: "Completed", value: counts.completed })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "New Request" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Coordinate care with other healthcare partners." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: createRequest, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Patient", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: patientId, onValueChange: setPatientId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", children: "No patient / general" }),
              appointments?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.full_name || p.email }, p.id))
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Partner type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: partnerType, onValueChange: (v) => setPartnerType(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "lab", children: "Lab" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "pharmacy", children: "Pharmacy" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "clinic", children: "Clinic" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "admin", children: "Admin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "other_doctor", children: "Other doctor" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Partner name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: partnerName, onChange: (e) => setPartnerName(e.target.value), placeholder: "Lab name, pharmacy, clinic..." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Message / request", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, value: message, onChange: (e) => setMessage(e.target.value), placeholder: "Example: Please prepare CBC lab test for this patient..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, children: saving ? "Sending..." : "Send request" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Request History" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: requests?.length ? requests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold capitalize", children: [
            request.partner_type.replace("_", " "),
            " ",
            request.partner_name ? `· ${request.partner_name}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Patient: ",
            request.patient?.full_name || "General",
            " · ",
            new Date(request.created_at).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 whitespace-pre-line text-sm text-muted-foreground", children: request.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: request.status, onValueChange: (v) => updateStatus(request.id, v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "sent", children: "Sent" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "reviewed", children: "Reviewed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "completed", children: "Completed" })
          ] })
        ] })
      ] }) }, request.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No care coordination requests yet." }) })
    ] })
  ] });
}
function Metric({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-lg gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] }) });
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
  CareCoordination as component
};
