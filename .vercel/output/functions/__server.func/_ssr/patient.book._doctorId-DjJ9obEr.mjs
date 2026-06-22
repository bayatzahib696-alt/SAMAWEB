import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as fmtAFN } from "./constants-BMfp__yZ.mjs";
import { c as Route$1 } from "./router-Dtls9AFd.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
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
import "../_libs/lucide-react.mjs";
const SLOTS = ["09:00", "10:00", "10:30", "11:00", "12:00", "14:00", "14:30", "15:00", "16:00", "17:00"];
function BookAppointment() {
  const {
    doctorId
  } = Route$1.useParams();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = reactExports.useState((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
  const [time, setTime] = reactExports.useState(SLOTS[0]);
  const [symptoms, setSymptoms] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const {
    data: doctor
  } = useQuery({
    queryKey: ["doctor-book", doctorId],
    queryFn: async () => {
      const {
        data: d
      } = await supabase.from("doctors").select("*").eq("id", doctorId).maybeSingle();
      if (!d) return null;
      const {
        data: p
      } = await supabase.from("profiles").select("full_name").eq("id", d.user_id).maybeSingle();
      return {
        ...d,
        profile: p
      };
    }
  });
  const submit = async (e) => {
    e.preventDefault();
    if (!user || !doctor) return;
    setLoading(true);
    const {
      data: appt,
      error
    } = await supabase.from("appointments").insert({
      patient_id: user.id,
      doctor_id: doctor.user_id,
      appointment_date: date,
      appointment_time: time,
      symptoms,
      status: "pending"
    }).select().single();
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    await supabase.from("payments").insert({
      appointment_id: appt.id,
      patient_id: user.id,
      doctor_id: doctor.user_id,
      amount: doctor.consultation_fee,
      currency: "AFN",
      status: "unpaid",
      payment_method: "cash"
    });
    setLoading(false);
    toast.success("Appointment requested! Status: Pending");
    navigate({
      to: "/patient/appointments"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-1 text-3xl font-bold tracking-tight", children: "Book Appointment" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-6 text-muted-foreground", children: "Submit your request — the doctor will confirm shortly." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: doctor ? `Dr. ${doctor.profile?.full_name} • ${doctor.specialty}` : "Loading..." }),
        doctor && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          "Fee: ",
          fmtAFN(doctor.consultation_fee)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", required: true, value: date, min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10), onChange: (e) => setDate(e.target.value) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: time, onValueChange: setTime, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SLOTS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Reason for visit / symptoms" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: symptoms, onChange: (e) => setSymptoms(e.target.value), placeholder: "Describe what you'd like to discuss..." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading || !doctor, children: loading ? "Submitting..." : "Submit Appointment Request" })
      ] }) })
    ] })
  ] });
}
export {
  BookAppointment as component
};
