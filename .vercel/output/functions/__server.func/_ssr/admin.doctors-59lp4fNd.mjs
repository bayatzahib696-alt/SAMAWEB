import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as fmtAFN } from "./constants-BMfp__yZ.mjs";
import { e as Check, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
function AdminDoctors() {
  const qc = useQueryClient();
  const {
    data
  } = useQuery({
    queryKey: ["admin-docs"],
    queryFn: async () => {
      const {
        data: docs
      } = await supabase.from("doctors").select("*").order("created_at", {
        ascending: false
      });
      if (!docs?.length) return [];
      const ids = docs.map((d) => d.user_id);
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", ids);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return docs.map((d) => ({
        ...d,
        profile: m.get(d.user_id)
      }));
    }
  });
  const setStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("doctors").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Doctor ${status}`);
    qc.invalidateQueries({
      queryKey: ["admin-docs"]
    });
  };
  const pending = (data ?? []).filter((d) => d.status === "pending");
  const others = (data ?? []).filter((d) => d.status !== "pending");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Doctor Approvals" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Review and approve doctor accounts." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-2 text-lg font-semibold", children: [
        "Pending (",
        pending.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        pending.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No pending doctors." }),
        pending.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(DocRow, { d, onApprove: () => setStatus(d.id, "approved"), onReject: () => setStatus(d.id, "rejected") }, d.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 text-lg font-semibold", children: "All Doctors" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: others.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(DocRow, { d }, d.id)) })
    ] })
  ] });
}
function DocRow({
  d,
  onApprove,
  onReject
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
        "Dr. ",
        d.profile?.full_name || "—",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs capitalize", children: d.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        d.specialty,
        " · License ",
        d.license_number,
        " · ",
        d.years_experience,
        "y · ",
        fmtAFN(d.consultation_fee)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
        d.profile?.email,
        " · ",
        d.profile?.phone
      ] })
    ] }),
    onApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: onApprove, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 h-4 w-4" }),
        " Approve"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: onReject, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-4 w-4" }),
        " Reject"
      ] })
    ] })
  ] }) });
}
export {
  AdminDoctors as component
};
