import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { s as statusColor } from "./constants-BMfp__yZ.mjs";
import { b as Search, C as Calendar, F as FileText, c as User, S as Stethoscope } from "../_libs/lucide-react.mjs";
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
function PatientDashboard() {
  const {
    user
  } = useAuth();
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    }
  });
  const {
    data: appts
  } = useQuery({
    queryKey: ["my-appts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await supabase.from("appointments").select("*").eq("patient_id", user.id).order("appointment_date", {
        ascending: false
      }).limit(5);
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold", children: [
        "Welcome back, ",
        profile?.full_name || "friend",
        " 👋"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Here's a quick overview of your care." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuickLink, { to: "/patient/doctors", icon: Search, label: "Find Doctor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuickLink, { to: "/patient/appointments", icon: Calendar, label: "My Appointments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuickLink, { to: "/patient/prescriptions", icon: FileText, label: "Prescriptions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuickLink, { to: "/patient/profile", icon: User, label: "Profile" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent appointments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patient/appointments", children: "View all" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !appts?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "No appointments yet." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patient/doctors", children: "Find a doctor" }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: appts.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
            a.appointment_date,
            " at ",
            a.appointment_time?.toString().slice(0, 5)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground line-clamp-1", children: a.symptoms || "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[a.status] || ""}`, children: a.status })
      ] }, a.id)) }) })
    ] })
  ] });
}
function QuickLink({
  to,
  icon: Icon,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to, className: "group flex items-center gap-3 rounded-xl border bg-background p-4 transition-all hover:border-primary/50 hover:shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: label })
  ] });
}
export {
  PatientDashboard as component
};
