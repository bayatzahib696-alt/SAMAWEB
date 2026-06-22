import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { Q as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
const appCss = "/assets/styles-Cj6F4UD2.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$u = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SAMA" },
      { name: "description", content: "SAMA connects patients with doctors for remote video consultations and prescription summaries." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "SAMA" },
      { property: "og:description", content: "SAMA connects patients with doctors for remote video consultations and prescription summaries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "SAMA" },
      { name: "twitter:description", content: "SAMA connects patients with doctors for remote video consultations and prescription summaries." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/351e3a57-e39d-46b5-8fac-145d3d9925c6/id-preview-a9c461bb--93188623-ef09-4703-84b4-b04657a194a4.lovable.app-1781017545183.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/351e3a57-e39d-46b5-8fac-145d3d9925c6/id-preview-a9c461bb--93188623-ef09-4703-84b4-b04657a194a4.lovable.app-1781017545183.png" }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" },
      { rel: "stylesheet", href: appCss }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$u.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-center" })
  ] });
}
const $$splitComponentImporter$s = () => import("./patient-zIN3ybih.mjs");
const Route$t = createFileRoute("/patient")({
  component: lazyRouteComponent($$splitComponentImporter$s, "component")
});
const $$splitComponentImporter$r = () => import("./doctor-CKgIkjEI.mjs");
const Route$s = createFileRoute("/doctor")({
  component: lazyRouteComponent($$splitComponentImporter$r, "component")
});
const $$splitComponentImporter$q = () => import("./admin-fvY-F5b2.mjs");
const Route$r = createFileRoute("/admin")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component")
});
const $$splitComponentImporter$p = () => import("./index-121q47GB.mjs");
const Route$q = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "SAMA — Connect with doctors online"
    }, {
      name: "description",
      content: "Book online doctor consultations across Afghanistan. Video visits, digital prescriptions, and trusted care in AFN."
    }, {
      property: "og:title",
      content: "SAMA"
    }, {
      property: "og:description",
      content: "Online doctor consultations for Afghanistan."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component")
});
const $$splitComponentImporter$o = () => import("./patient.index--rBZd5ZS.mjs");
const Route$p = createFileRoute("/patient/")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component")
});
const $$splitComponentImporter$n = () => import("./doctor.index-Bhp0YAAh.mjs");
const Route$o = createFileRoute("/doctor/")({
  component: lazyRouteComponent($$splitComponentImporter$n, "component")
});
const $$splitComponentImporter$m = () => import("./admin.index-qq5jDM-z.mjs");
const Route$n = createFileRoute("/admin/")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component")
});
const $$splitComponentImporter$l = () => import("./video._id-ColVO6VV.mjs");
const Route$m = createFileRoute("/video/$id")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component")
});
const $$splitComponentImporter$k = () => import("./prescription._id-Dq0kBfJo.mjs");
const Route$l = createFileRoute("/prescription/$id")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component")
});
const $$splitComponentImporter$j = () => import("./patient.profile-C9Dh6ioM.mjs");
const Route$k = createFileRoute("/patient/profile")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./patient.prescriptions-bBW5_h45.mjs");
const Route$j = createFileRoute("/patient/prescriptions")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./patient.doctors-DCAYgAEB.mjs");
const Route$i = createFileRoute("/patient/doctors")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./patient.appointments-Cr-nNqwT.mjs");
const Route$h = createFileRoute("/patient/appointments")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./doctor.profile-DRfTJd7P.mjs");
const Route$g = createFileRoute("/doctor/profile")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./doctor.posts-B3sRYlqX.mjs");
const Route$f = createFileRoute("/doctor/posts")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./doctor.care-coordination-DtoFx9tR.mjs");
const Route$e = createFileRoute("/doctor/care-coordination")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const Route$d = createFileRoute("/doctor/appointments")({
  beforeLoad: () => {
    throw redirect({ to: "/doctor" });
  }
});
const $$splitComponentImporter$c = () => import("./auth.patient-BnR7JD3K.mjs");
const Route$c = createFileRoute("/auth/patient")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./auth.doctor-BWGk_4mp.mjs");
const Route$b = createFileRoute("/auth/doctor")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./auth.admin-xbajNK9p.mjs");
const Route$a = createFileRoute("/auth/admin")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./admin.users-CkZG3PEG.mjs");
const Route$9 = createFileRoute("/admin/users")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./admin.reviews-CHSzLTMX.mjs");
const Route$8 = createFileRoute("/admin/reviews")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./admin.posts-C7usKePa.mjs");
const Route$7 = createFileRoute("/admin/posts")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./admin.payments-BBB_Oyj5.mjs");
const Route$6 = createFileRoute("/admin/payments")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./admin.doctors-59lp4fNd.mjs");
const Route$5 = createFileRoute("/admin/doctors")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./admin.care-coordination-D8Y8mOil.mjs");
const Route$4 = createFileRoute("/admin/care-coordination")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./admin.appointments-D20-BJ9V.mjs");
const Route$3 = createFileRoute("/admin/appointments")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./patient.doctors._id-SGOCGFaB.mjs");
const Route$2 = createFileRoute("/patient/doctors/$id")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./patient.book._doctorId-DjJ9obEr.mjs");
const Route$1 = createFileRoute("/patient/book/$doctorId")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./doctor.prescription._id-ob7K_X2I.mjs");
const Route = createFileRoute("/doctor/prescription/$id")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const PatientRoute = Route$t.update({
  id: "/patient",
  path: "/patient",
  getParentRoute: () => Route$u
});
const DoctorRoute = Route$s.update({
  id: "/doctor",
  path: "/doctor",
  getParentRoute: () => Route$u
});
const AdminRoute = Route$r.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$u
});
const IndexRoute = Route$q.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$u
});
const PatientIndexRoute = Route$p.update({
  id: "/",
  path: "/",
  getParentRoute: () => PatientRoute
});
const DoctorIndexRoute = Route$o.update({
  id: "/",
  path: "/",
  getParentRoute: () => DoctorRoute
});
const AdminIndexRoute = Route$n.update({
  id: "/",
  path: "/",
  getParentRoute: () => AdminRoute
});
const VideoIdRoute = Route$m.update({
  id: "/video/$id",
  path: "/video/$id",
  getParentRoute: () => Route$u
});
const PrescriptionIdRoute = Route$l.update({
  id: "/prescription/$id",
  path: "/prescription/$id",
  getParentRoute: () => Route$u
});
const PatientProfileRoute = Route$k.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => PatientRoute
});
const PatientPrescriptionsRoute = Route$j.update({
  id: "/prescriptions",
  path: "/prescriptions",
  getParentRoute: () => PatientRoute
});
const PatientDoctorsRoute = Route$i.update({
  id: "/doctors",
  path: "/doctors",
  getParentRoute: () => PatientRoute
});
const PatientAppointmentsRoute = Route$h.update({
  id: "/appointments",
  path: "/appointments",
  getParentRoute: () => PatientRoute
});
const DoctorProfileRoute = Route$g.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => DoctorRoute
});
const DoctorPostsRoute = Route$f.update({
  id: "/posts",
  path: "/posts",
  getParentRoute: () => DoctorRoute
});
const DoctorCareCoordinationRoute = Route$e.update({
  id: "/care-coordination",
  path: "/care-coordination",
  getParentRoute: () => DoctorRoute
});
const DoctorAppointmentsRoute = Route$d.update({
  id: "/appointments",
  path: "/appointments",
  getParentRoute: () => DoctorRoute
});
const AuthPatientRoute = Route$c.update({
  id: "/auth/patient",
  path: "/auth/patient",
  getParentRoute: () => Route$u
});
const AuthDoctorRoute = Route$b.update({
  id: "/auth/doctor",
  path: "/auth/doctor",
  getParentRoute: () => Route$u
});
const AuthAdminRoute = Route$a.update({
  id: "/auth/admin",
  path: "/auth/admin",
  getParentRoute: () => Route$u
});
const AdminUsersRoute = Route$9.update({
  id: "/users",
  path: "/users",
  getParentRoute: () => AdminRoute
});
const AdminReviewsRoute = Route$8.update({
  id: "/reviews",
  path: "/reviews",
  getParentRoute: () => AdminRoute
});
const AdminPostsRoute = Route$7.update({
  id: "/posts",
  path: "/posts",
  getParentRoute: () => AdminRoute
});
const AdminPaymentsRoute = Route$6.update({
  id: "/payments",
  path: "/payments",
  getParentRoute: () => AdminRoute
});
const AdminDoctorsRoute = Route$5.update({
  id: "/doctors",
  path: "/doctors",
  getParentRoute: () => AdminRoute
});
const AdminCareCoordinationRoute = Route$4.update({
  id: "/care-coordination",
  path: "/care-coordination",
  getParentRoute: () => AdminRoute
});
const AdminAppointmentsRoute = Route$3.update({
  id: "/appointments",
  path: "/appointments",
  getParentRoute: () => AdminRoute
});
const PatientDoctorsIdRoute = Route$2.update({
  id: "/$id",
  path: "/$id",
  getParentRoute: () => PatientDoctorsRoute
});
const PatientBookDoctorIdRoute = Route$1.update({
  id: "/book/$doctorId",
  path: "/book/$doctorId",
  getParentRoute: () => PatientRoute
});
const DoctorPrescriptionIdRoute = Route.update({
  id: "/prescription/$id",
  path: "/prescription/$id",
  getParentRoute: () => DoctorRoute
});
const AdminRouteChildren = {
  AdminAppointmentsRoute,
  AdminCareCoordinationRoute,
  AdminDoctorsRoute,
  AdminPaymentsRoute,
  AdminPostsRoute,
  AdminReviewsRoute,
  AdminUsersRoute,
  AdminIndexRoute
};
const AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
const DoctorRouteChildren = {
  DoctorAppointmentsRoute,
  DoctorCareCoordinationRoute,
  DoctorPostsRoute,
  DoctorProfileRoute,
  DoctorIndexRoute,
  DoctorPrescriptionIdRoute
};
const DoctorRouteWithChildren = DoctorRoute._addFileChildren(DoctorRouteChildren);
const PatientDoctorsRouteChildren = {
  PatientDoctorsIdRoute
};
const PatientDoctorsRouteWithChildren = PatientDoctorsRoute._addFileChildren(
  PatientDoctorsRouteChildren
);
const PatientRouteChildren = {
  PatientAppointmentsRoute,
  PatientDoctorsRoute: PatientDoctorsRouteWithChildren,
  PatientPrescriptionsRoute,
  PatientProfileRoute,
  PatientIndexRoute,
  PatientBookDoctorIdRoute
};
const PatientRouteWithChildren = PatientRoute._addFileChildren(PatientRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AdminRoute: AdminRouteWithChildren,
  DoctorRoute: DoctorRouteWithChildren,
  PatientRoute: PatientRouteWithChildren,
  AuthAdminRoute,
  AuthDoctorRoute,
  AuthPatientRoute,
  PrescriptionIdRoute,
  VideoIdRoute
};
const routeTree = Route$u._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$m as R,
  Route$l as a,
  Route$2 as b,
  Route$1 as c,
  Route as d,
  router as r
};
