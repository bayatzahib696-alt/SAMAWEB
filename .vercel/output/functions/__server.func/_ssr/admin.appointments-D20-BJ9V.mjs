import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { s as statusColor } from "./constants-BMfp__yZ.mjs";
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
function AdminAppts() {
  const {
    data
  } = useQuery({
    queryKey: ["admin-appts"],
    queryFn: async () => {
      const {
        data: a
      } = await supabase.from("appointments").select("*").order("created_at", {
        ascending: false
      });
      if (!a?.length) return [];
      const ids = [...new Set(a.flatMap((x) => [x.patient_id, x.doctor_id]))];
      const {
        data: p
      } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const m = new Map((p ?? []).map((x) => [x.id, x]));
      return a.map((x) => ({
        ...x,
        patient: m.get(x.patient_id),
        doctor: m.get(x.doctor_id)
      }));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Appointments" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Doctor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "When" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (data ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: a.patient?.full_name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
          "Dr. ",
          a.doctor?.full_name || "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
          a.appointment_date,
          " ",
          a.appointment_time?.toString().slice(0, 5)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2 py-0.5 text-xs capitalize ${statusColor[a.status]}`, children: a.status }) })
      ] }, a.id)) })
    ] }) }) }) })
  ] });
}
export {
  AdminAppts as component
};
