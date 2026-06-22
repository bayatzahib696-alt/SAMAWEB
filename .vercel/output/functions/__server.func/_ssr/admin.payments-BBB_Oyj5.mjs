import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { f as fmtAFN, s as statusColor } from "./constants-BMfp__yZ.mjs";
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
function AdminPayments() {
  const {
    data
  } = useQuery({
    queryKey: ["admin-pay"],
    queryFn: async () => {
      const {
        data: p
      } = await supabase.from("payments").select("*").order("created_at", {
        ascending: false
      });
      if (!p?.length) return [];
      const ids = [...new Set(p.flatMap((x) => [x.patient_id, x.doctor_id]))];
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const m = new Map((profs ?? []).map((x) => [x.id, x]));
      return p.map((x) => ({
        ...x,
        patient: m.get(x.patient_id),
        doctor: m.get(x.doctor_id)
      }));
    }
  });
  const total = (data ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Payments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Total revenue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: fmtAFN(total) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-secondary text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Doctor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Method" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left", children: "Status" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (data ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: p.patient?.full_name || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
          "Dr. ",
          p.doctor?.full_name || "—"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium", children: fmtAFN(p.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 capitalize", children: p.payment_method || "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2 py-0.5 text-xs capitalize ${statusColor[p.status]}`, children: p.status }) })
      ] }, p.id)) })
    ] }) }) }) })
  ] });
}
export {
  AdminPayments as component
};
