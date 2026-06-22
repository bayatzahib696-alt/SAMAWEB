import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { s as statusColor } from "./constants-BMfp__yZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { C as Calendar, d as Clock, e as Check, f as ListChecks, X, V as Video, F as FileText } from "../_libs/lucide-react.mjs";
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
function DoctorDashboard() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const {
    data: doctor
  } = useQuery({
    queryKey: ["doctor-self", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("doctors").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    }
  });
  const {
    data: appts
  } = useQuery({
    queryKey: ["doc-appts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: a
      } = await supabase.from("appointments").select("*").eq("doctor_id", user.id).order("appointment_date", {
        ascending: false
      });
      if (!a?.length) return [];
      const ids = [...new Set(a.map((x) => x.patient_id))];
      const {
        data: p
      } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const m = new Map((p ?? []).map((x) => [x.id, x]));
      return a.map((x) => ({
        ...x,
        patient: m.get(x.patient_id)
      }));
    }
  });
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const todays = (appts ?? []).filter((a) => a.appointment_date === today);
  const pending = (appts ?? []).filter((a) => a.status === "pending");
  const confirmed = (appts ?? []).filter((a) => a.status === "confirmed");
  const completed = (appts ?? []).filter((a) => a.status === "completed");
  const setStatus = async (id, status) => {
    const {
      error
    } = await supabase.from("appointments").update({
      status
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Appointment ${status}`);
    qc.invalidateQueries({
      queryKey: ["doc-appts"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Doctor Dashboard" }),
      doctor?.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 rounded-lg border border-warning/40 bg-warning/10 px-4 py-2 text-sm", children: "⏳ Your account is pending admin approval. You won't appear in patient searches until approved." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Calendar, label: "Today", value: todays.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Clock, label: "Pending", value: pending.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: Check, label: "Confirmed", value: confirmed.length }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { icon: ListChecks, label: "Completed", value: completed.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Pending requests", items: pending, actions: (a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setStatus(a.id, "confirmed"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 h-4 w-4" }),
        " Accept"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", onClick: () => setStatus(a.id, "rejected"), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1 h-4 w-4" }),
        " Reject"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Confirmed appointments", items: confirmed, actions: (a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/video/$id", params: {
        id: a.id
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "mr-1 h-4 w-4" }),
        " Start"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/doctor/prescription/$id", params: {
        id: a.id
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
        " Prescribe"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Completed appointments", items: completed, actions: (a) => /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "sm", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/prescription/$id", params: {
      id: a.id
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "mr-1 h-4 w-4" }),
      " Summary"
    ] }) }) })
  ] });
}
function StatCard({
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
function Section({
  title,
  items,
  actions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No items." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: items.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: a.patient?.full_name || "Patient" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
          a.appointment_date,
          " at ",
          a.appointment_time?.toString().slice(0, 5),
          " · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded px-1.5 ${statusColor[a.status]}`, children: a.status })
        ] }),
        a.symptoms && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm line-clamp-1", children: a.symptoms })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: actions(a) })
    ] }, a.id)) }) })
  ] });
}
export {
  DoctorDashboard as component
};
