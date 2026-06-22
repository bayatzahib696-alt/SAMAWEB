import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { S as Stethoscope, L as LogOut } from "../_libs/lucide-react.mjs";
function AppShell({ children, requiredRole, nav = [], title }) {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/" });
      return;
    }
    if (requiredRole && (!role || role !== requiredRole)) {
      navigate({ to: "/" });
    }
  }, [loading, user, role, requiredRole, navigate]);
  if (loading || !user || requiredRole && (!role || role !== requiredRole)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-40 border-b bg-card/80 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-9 w-9 place-items-center rounded-lg gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5 text-primary-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold tracking-tight", children: "SAMA" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden gap-1 md:flex", children: nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: n.to,
            className: "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
            activeProps: { className: "bg-accent text-accent-foreground" },
            children: n.label
          },
          n.to
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", onClick: signOut, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
          " Sign out"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 overflow-x-auto border-t bg-card px-4 py-2 md:hidden", children: nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          className: "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent",
          activeProps: { className: "bg-accent text-accent-foreground" },
          children: n.label
        },
        n.to
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6", children: [
      title && /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mb-6 text-3xl font-bold tracking-tight", children: title }),
      children
    ] })
  ] });
}
export {
  AppShell as A
};
