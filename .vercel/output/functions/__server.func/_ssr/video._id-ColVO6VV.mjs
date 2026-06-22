import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Route$m } from "./router-Dtls9AFd.mjs";
import { S as Stethoscope, M as MicOff, j as Mic, V as Video, k as VideoOff, P as PhoneOff } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function VideoCall() {
  const {
    id
  } = Route$m.useParams();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [muted, setMuted] = reactExports.useState(false);
  const [cam, setCam] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!loading && !user) navigate({
      to: "/"
    });
  }, [loading, user, navigate]);
  const {
    data
  } = useQuery({
    queryKey: ["video", id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: a
      } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();
      if (!a) return null;
      const {
        data: profs
      } = await supabase.from("profiles").select("id, full_name").in("id", [a.patient_id, a.doctor_id]);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return {
        ...a,
        patient: m.get(a.patient_id),
        doctor: m.get(a.doctor_id)
      };
    }
  });
  if (!data) return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center text-muted-foreground", children: "Loading…" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen flex-col bg-[oklch(0.15_0.03_240)] text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: "SAMA — Video Consultation" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm opacity-70", children: [
        data.appointment_date,
        " ",
        data.appointment_time?.toString().slice(0, 5)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid flex-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(VideoTile, { name: `Dr. ${data.doctor?.full_name || "—"}`, role: "Doctor" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(VideoTile, { name: data.patient?.full_name || "Patient", role: "Patient", muted, camOn: cam, you: true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-3 border-t border-white/10 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: muted ? "destructive" : "secondary", onClick: () => setMuted((m) => !m), children: muted ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "lg", variant: !cam ? "destructive" : "secondary", onClick: () => setCam((c) => !c), children: cam ? /* @__PURE__ */ jsxRuntimeExports.jsx(Video, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(VideoOff, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "lg", variant: "destructive", onClick: () => {
        toast.info("Call ended");
        navigate({
          to: "/"
        });
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "mr-2" }),
        " End Call"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-white/10 bg-black/30 px-4 py-2 text-center text-xs opacity-70", children: [
      "Prototype placeholder — real video integration coming soon.",
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "ml-3 underline", children: "Exit" })
    ] })
  ] });
}
function VideoTile({
  name,
  role,
  muted,
  camOn = true,
  you
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid min-h-[260px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[oklch(0.25_0.05_240)] to-[oklch(0.18_0.04_245)]", children: [
    camOn ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-24 w-24 place-items-center rounded-full bg-white/10 text-3xl font-bold", children: name.charAt(0).toUpperCase() }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm opacity-60", children: "Camera off" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs backdrop-blur", children: [
      name,
      " ",
      you && "(You)",
      " · ",
      role,
      " ",
      muted && "· muted"
    ] })
  ] });
}
export {
  VideoCall as component
};
