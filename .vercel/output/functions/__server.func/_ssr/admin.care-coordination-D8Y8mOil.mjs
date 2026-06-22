import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as Send } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
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
function AdminCareCoordination() {
  const qc = useQueryClient();
  const {
    data: requests
  } = useQuery({
    queryKey: ["admin-partner-messages"],
    queryFn: async () => {
      const {
        data
      } = await db.from("partner_messages").select("*").order("created_at", {
        ascending: false
      });
      if (!data?.length) return [];
      const ids = [...new Set(data.flatMap((r) => [r.doctor_id, r.patient_id]).filter(Boolean))];
      const {
        data: profiles
      } = await db.from("profiles").select("id, full_name, email").in("id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return data.map((r) => ({
        ...r,
        doctor: map.get(r.doctor_id),
        patient: map.get(r.patient_id)
      }));
    }
  });
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
      queryKey: ["admin-partner-messages"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Care Coordination Requests" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Admin view for doctor requests to labs, pharmacy, clinics, admin, and other doctors." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "All Requests" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: requests?.length ? requests.map((request) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold capitalize", children: [
            request.partner_type.replace("_", " "),
            " ",
            request.partner_name ? `· ${request.partner_name}` : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Doctor: ",
            request.doctor?.full_name || request.doctor?.email || "Doctor",
            " · Patient: ",
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
      ] }) }, request.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No requests yet." }) })
    ] })
  ] });
}
export {
  AdminCareCoordination as component
};
