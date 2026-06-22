import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { s as statusColor } from "./constants-BMfp__yZ.mjs";
import { C as Calendar, V as Video, F as FileText } from "../_libs/lucide-react.mjs";
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
function PatientAppointments() {
  const {
    user
  } = useAuth();
  const {
    data: appts
  } = useQuery({
    queryKey: ["patient-appts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: a
      } = await supabase.from("appointments").select("*").eq("patient_id", user.id).order("appointment_date", {
        ascending: false
      });
      if (!a?.length) return [];
      const ids = [...new Set(a.map((x) => x.doctor_id))];
      const {
        data: p
      } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const {
        data: docs
      } = await supabase.from("doctors").select("user_id, specialty").in("user_id", ids);
      const pm = new Map((p ?? []).map((x) => [x.id, x]));
      const dm = new Map((docs ?? []).map((x) => [x.user_id, x]));
      return a.map((x) => ({
        ...x,
        doctor_profile: pm.get(x.doctor_id),
        doctor: dm.get(x.doctor_id)
      }));
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "My Appointments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Track all your bookings." })
    ] }),
    !appts?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "No appointments yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patient/doctors", children: "Find a doctor" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: appts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
            "Dr. ",
            a.doctor_profile?.full_name || "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: a.doctor?.specialty })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-sm text-muted-foreground", children: [
          a.appointment_date,
          " at ",
          a.appointment_time?.toString().slice(0, 5)
        ] }),
        a.symptoms && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm line-clamp-1", children: a.symptoms })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusColor[a.status] || ""}`, children: a.status }),
        a.status === "confirmed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/video/$id", params: {
          id: a.id
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "mr-1 h-4 w-4" }),
          " Join"
        ] }) }),
        a.status === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/prescription/$id", params: {
          id: a.id
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
          " Prescription"
        ] }) })
      ] })
    ] }) }, a.id)) })
  ] });
}
export {
  PatientAppointments as component
};
