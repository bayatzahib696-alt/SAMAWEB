import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { e as useRouterState, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { C as Card, c as CardContent } from "./card-DCDRzI6q.mjs";
import { S as SPECIALTIES, f as fmtAFN } from "./constants-BMfp__yZ.mjs";
import { b as Search, S as Stethoscope, h as Star, n as Languages, o as MapPin } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-select.mjs";
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
import "../_libs/class-variance-authority.mjs";
const db = supabase;
function PatientDoctorsRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname
  });
  const cleanPath = pathname.replace(/\/+$/, "");
  if (cleanPath !== "/patient/doctors") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FindDoctor, {});
}
function FindDoctor() {
  const [q, setQ] = reactExports.useState("");
  const [spec, setSpec] = reactExports.useState("all");
  const [city, setCity] = reactExports.useState("all");
  const [online, setOnline] = reactExports.useState("all");
  const {
    data: doctors = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["doctors-approved-advanced"],
    queryFn: async () => {
      const {
        data: docs,
        error: docsError
      } = await db.from("doctors").select("*").eq("status", "approved");
      if (docsError) {
        console.error("Doctors load error:", docsError);
        throw docsError;
      }
      if (!docs?.length) return [];
      const userIds = docs.map((d) => d.user_id).filter(Boolean);
      const uniqueUserIds = Array.from(new Set(userIds));
      const {
        data: profs
      } = uniqueUserIds.length ? await db.from("profiles").select("id, full_name, phone, email").in("id", uniqueUserIds) : {
        data: []
      };
      const {
        data: reviews
      } = uniqueUserIds.length ? await db.from("doctor_reviews").select("doctor_id, rating").in("doctor_id", uniqueUserIds) : {
        data: []
      };
      const profMap = new Map((profs ?? []).map((p) => [p.id, p]));
      const ratingMap = /* @__PURE__ */ new Map();
      for (const review of reviews ?? []) {
        const current = ratingMap.get(review.doctor_id) ?? {
          total: 0,
          count: 0
        };
        current.total += Number(review.rating || 0);
        current.count += 1;
        ratingMap.set(review.doctor_id, current);
      }
      return docs.map((d) => {
        const rating = ratingMap.get(d.user_id);
        return {
          ...d,
          profile: profMap.get(d.user_id),
          average_rating: rating?.count ? rating.total / rating.count : 0,
          review_count: rating?.count ?? 0
        };
      });
    }
  });
  const cities = reactExports.useMemo(() => {
    const set = new Set((doctors ?? []).map((d) => d.city).filter(Boolean));
    return Array.from(set);
  }, [doctors]);
  const filtered = (doctors ?? []).filter((d) => {
    const name = d.profile?.full_name || "";
    const matchesQ = !q || name.toLowerCase().includes(q.toLowerCase()) || d.specialty?.toLowerCase().includes(q.toLowerCase());
    const matchesSpec = spec === "all" || d.specialty === spec;
    const matchesCity = city === "all" || d.city === city;
    const matchesOnline = online === "all" || (online === "online" ? d.is_online : !d.is_online);
    return matchesQ && matchesSpec && matchesCity && matchesOnline;
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-muted-foreground", children: "Loading doctors..." });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive", children: "Could not load doctors. Check Supabase tables and policies." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Find a Doctor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Browse verified doctors, compare profiles, ratings, languages, and availability." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-3 pt-6 md:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative md:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search by doctor name or specialty...", value: q, onChange: (e) => setQ(e.target.value), className: "pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: spec, onValueChange: setSpec, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Specialty" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All specialties" }),
          SPECIALTIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: online, onValueChange: setOnline, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "Online or offline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "online", children: "Online now" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "offline", children: "Offline" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: city, onValueChange: setCity, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "City" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All cities" }),
          cities.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c))
        ] })
      ] })
    ] }) }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-dashed p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "mx-auto h-10 w-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-muted-foreground", children: "No doctors match your search." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((d) => {
      const doctorProfileId = String(d.id || d.user_id);
      const bannerUrl = d.banner_url || d.banner_image_url;
      const doctorName = d.profile?.full_name || "Doctor";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden transition-shadow hover:shadow-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 bg-gradient-to-r from-primary to-accent", children: bannerUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bannerUrl, alt: "Doctor banner", className: "h-full w-full object-cover" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 pt-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mt-8 flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border-4 border-background gradient-medical text-lg font-bold text-primary-foreground", children: d.profile_photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: d.profile_photo_url, alt: "Doctor", className: "h-full w-full object-cover" }) : doctorName.charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  "Dr. ",
                  doctorName
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: d.specialty })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mt-8 rounded-full px-2 py-0.5 text-xs font-medium ${d.is_online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: d.is_online ? "Online" : "Offline" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Experience", value: `${d.years_experience || 0} yrs` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { label: "Fee", value: fmtAFN(d.consultation_fee || 0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: Star, label: "Rating", value: d.average_rating ? `${d.average_rating.toFixed(1)} (${d.review_count})` : "New" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: Languages, label: "Languages", value: Array.isArray(d.languages) ? d.languages.join(", ") : d.languages || "Dari" })
          ] }),
          d.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-1 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }),
            d.city
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", className: "mt-4 w-full", onClick: () => {
            window.location.href = `/patient/doctors/${doctorProfileId}`;
          }, children: "View Profile" })
        ] })
      ] }, doctorProfileId);
    }) })
  ] });
}
function Info({
  label,
  value,
  icon: Icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
      Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "line-clamp-1 font-medium", children: value })
  ] });
}
export {
  PatientDoctorsRoute as component
};
