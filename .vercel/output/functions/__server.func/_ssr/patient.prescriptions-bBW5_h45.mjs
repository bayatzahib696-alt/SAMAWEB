import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { F as FileText } from "../_libs/lucide-react.mjs";
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
function PatientPrescriptions() {
  const {
    user
  } = useAuth();
  const {
    data: items
  } = useQuery({
    queryKey: ["patient-rx", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("prescriptions").select("*").eq("patient_id", user.id).order("created_at", {
        ascending: false
      });
      if (!data?.length) return [];
      const docIds = [...new Set(data.map((d) => d.doctor_id))];
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name").in("id", docIds);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return data.map((r) => ({
        ...r,
        doctor_profile: m.get(r.doctor_id)
      }));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "My Prescriptions" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "All visit summaries and prescriptions." })
    ] }),
    !items?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "No prescriptions yet." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2", children: items.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: new Date(r.created_at).toLocaleDateString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-semibold", children: [
        "Dr. ",
        r.doctor_profile?.full_name || "—"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "Diagnosis:" }),
        " ",
        r.diagnosis
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/prescription/$id", params: {
        id: r.appointment_id
      }, children: "View full summary" }) })
    ] }) }, r.id)) })
  ] });
}
export {
  PatientPrescriptions as component
};
