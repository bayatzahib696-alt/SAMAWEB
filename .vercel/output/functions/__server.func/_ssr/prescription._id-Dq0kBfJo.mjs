import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { a as Route$l } from "./router-Dtls9AFd.mjs";
import "../_libs/sonner.mjs";
import { F as FileText, A as ArrowLeft, l as Printer } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
function PrescriptionPage() {
  const {
    id
  } = Route$l.useParams();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/"
    });
  }, [loading, user, navigate]);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["rx", id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: rx2
      } = await supabase.from("prescriptions").select("*").eq("appointment_id", id).maybeSingle();
      const {
        data: appt2
      } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();
      if (!appt2) return null;
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name").in("id", [appt2.patient_id, appt2.doctor_id]);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return {
        rx: rx2,
        appt: appt2,
        doctor: m.get(appt2.doctor_id),
        patient: m.get(appt2.patient_id)
      };
    }
  });
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-12 text-center text-muted-foreground", children: "Loading…" });
  if (!data?.rx) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl p-8 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "No prescription has been written yet for this appointment." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: "Back" }) })
  ] });
  const {
    rx,
    appt,
    doctor,
    patient
  } = data;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-secondary/40 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => history.back(), className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => window.print(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "mr-2 h-4 w-4" }),
        " Print"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Visit Summary & Prescription" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "SAMA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Date: ",
            new Date(rx.created_at).toLocaleDateString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            "Visit: ",
            appt.appointment_date
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Patient", value: patient?.full_name || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Doctor", value: `Dr. ${doctor?.full_name || "—"}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Diagnosis", value: rx.diagnosis }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Prescription / Medicine", value: rx.medicine }),
        rx.instructions && /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Instructions", value: rx.instructions }),
        rx.follow_up_notes && /* @__PURE__ */ jsxRuntimeExports.jsx(Block, { label: "Follow-up notes", value: rx.follow_up_notes })
      ] })
    ] })
  ] }) });
}
function Block({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 whitespace-pre-wrap text-sm leading-relaxed", children: value })
  ] });
}
export {
  PrescriptionPage as component
};
