import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { S as Stethoscope, C as Calendar, V as Video, F as FileText, a as ShieldCheck, U as UserCog } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b bg-card/60 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold tracking-tight", children: "SAMA" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden gap-2 sm:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/admin", children: "Admin" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/doctor", children: "Doctor" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/patient", children: "Patient login" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 -z-10 opacity-30", style: {
        backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-primary-glow), transparent 50%), radial-gradient(circle at 80% 60%, var(--color-accent), transparent 55%)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid items-center gap-12 lg:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-success" }),
            " Trusted by clinics across Afghanistan"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl", children: [
            "See a doctor ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-medical", children: "from anywhere" }),
            " in Afghanistan"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-xl text-lg text-muted-foreground", children: "Book appointments with verified doctors, meet over video consultations, and get digital prescriptions — all in one secure place. Pricing in AFN." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/patient", children: "I'm a Patient" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/doctor", children: "I'm a Doctor" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, size: "lg", variant: "ghost", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth/admin", children: "Admin login" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 grid grid-cols-3 gap-6 max-w-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "500+", l: "Doctors" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "10k+", l: "Patients" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { n: "24/7", l: "Support" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border bg-card p-6 shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full gradient-medical" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: "Dr. Ahmad Karimi" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Cardiologist • 12 yrs" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success", children: "Online" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Slot, { t: "09:00" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Slot, { t: "10:30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Slot, { t: "14:00" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Slot, { t: "16:30" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between rounded-xl bg-secondary p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Consultation fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold", children: "800 AFN" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", children: "Book now" })
          ] })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "border-t bg-card/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-4 py-20 sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight sm:text-4xl", children: "Everything you need for online care" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-3 max-w-2xl text-muted-foreground", children: "From booking to prescription — fast, simple, and secure." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Calendar, title: "Book consultations", desc: "Choose your doctor, pick a time slot, and book online in seconds." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Video, title: "Video consultation", desc: "Meet your doctor face-to-face from your phone or laptop." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: FileText, title: "Digital prescriptions", desc: "Receive prescriptions and visit summaries you can save and share." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: ShieldCheck, title: "Verified doctors", desc: "Every doctor is reviewed and approved by our admin team." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: Stethoscope, title: "Multiple specialties", desc: "Find the right specialist — from cardiology to dermatology." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Feature, { icon: UserCog, title: "Manage your care", desc: "Keep all your appointments and prescriptions in one place." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "border-t bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-4 w-4" }),
        " SAMA © ",
        (/* @__PURE__ */ new Date()).getFullYear()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Built for the Afghanistan market. Currency: AFN." })
    ] }) })
  ] });
}
function Stat({
  n,
  l
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold", children: n }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: l })
  ] });
}
function Slot({
  t
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-background p-2 text-center font-medium", children: t });
}
function Feature({
  icon: Icon,
  title,
  desc
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-lg font-semibold", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: desc })
  ] });
}
export {
  Landing as component
};
