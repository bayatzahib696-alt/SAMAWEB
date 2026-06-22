import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { f as fmtAFN, s as statusColor } from "./constants-BMfp__yZ.mjs";
import { g as Users, S as Stethoscope, d as Clock, C as Calendar, W as Wallet, N as Newspaper, h as Star, i as Send } from "../_libs/lucide-react.mjs";
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
function AdminDash() {
  const {
    data
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const db = supabase;
      const [pats, docs, pend, appts, pays, recent, posts, reviews, requests] = await Promise.all([db.from("user_roles").select("*", {
        count: "exact",
        head: true
      }).eq("role", "patient"), db.from("doctors").select("*", {
        count: "exact",
        head: true
      }).eq("status", "approved"), db.from("doctors").select("*", {
        count: "exact",
        head: true
      }).eq("status", "pending"), db.from("appointments").select("*", {
        count: "exact",
        head: true
      }), db.from("payments").select("amount,status"), db.from("appointments").select("*").order("created_at", {
        ascending: false
      }).limit(8), db.from("doctor_posts").select("*", {
        count: "exact",
        head: true
      }), db.from("doctor_reviews").select("*", {
        count: "exact",
        head: true
      }), db.from("partner_messages").select("*", {
        count: "exact",
        head: true
      }).eq("status", "sent")]);
      const paid = (pays.data ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
      let recentEnriched = recent.data ?? [];
      if (recentEnriched.length) {
        const ids = [...new Set(recentEnriched.flatMap((a) => [a.patient_id, a.doctor_id]))];
        const {
          data: profs
        } = await db.from("profiles").select("id, full_name").in("id", ids);
        const m = new Map((profs ?? []).map((p) => [p.id, p]));
        recentEnriched = recentEnriched.map((a) => ({
          ...a,
          patient: m.get(a.patient_id),
          doctor: m.get(a.doctor_id)
        }));
      }
      return {
        patients: pats.count ?? 0,
        doctors: docs.count ?? 0,
        pending: pend.count ?? 0,
        appts: appts.count ?? 0,
        paid,
        recent: recentEnriched,
        posts: posts.count ?? 0,
        reviews: reviews.count ?? 0,
        requests: requests.count ?? 0
      };
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Admin Dashboard" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Users, label: "Patients", value: data?.patients ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Stethoscope, label: "Approved Doctors", value: data?.doctors ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: "Pending Doctors", value: data?.pending ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Calendar, label: "Appointments", value: data?.appts ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Wallet, label: "Revenue", value: fmtAFN(data?.paid ?? 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Newspaper, label: "Doctor Posts", value: data?.posts ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Star, label: "Reviews", value: data?.reviews ?? 0 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Send, label: "Open Care Requests", value: data?.requests ?? 0 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Recent Appointments" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: !data?.recent?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No appointments yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y", children: data.recent.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between py-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-medium", children: [
            a.patient?.full_name || "—",
            " → Dr. ",
            a.doctor?.full_name || "—"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            a.appointment_date,
            " ",
            a.appointment_time?.toString().slice(0, 5)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full border px-2 py-0.5 text-xs capitalize ${statusColor[a.status]}`, children: a.status })
      ] }, a.id)) }) })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex items-center gap-3 p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-lg gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xl font-bold", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] }) });
}
export {
  AdminDash as component
};
