import { Link } from "@tanstack/react-router";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { LanguageSwitcher, SamaLogo, useLanguage } from "@/lib/language";

interface AppShellProps {
  children: ReactNode;
  requiredRole?: AppRole;
  nav?: { to: string; label: string }[];
  title: string;
}

function translateNavLabel(label: string, t: ReturnType<typeof useLanguage>["t"]) {
  const key = label.toLowerCase().trim();
  const map: Record<string, Parameters<typeof t>[0]> = {
    dashboard: "dashboard",
    appointments: "appointments",
    doctors: "doctors",
    patients: "patients",
    profile: "profile",
    reviews: "reviews",
    posts: "posts",
    "care coordination": "careCoordination",
    payments: "payments",
    users: "users",
  };

  return map[key] ? t(map[key]) : label;
}

export function AppShell({ children, requiredRole, nav = [], title }: AppShellProps) {
  const { user, role, loading, signOut } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">{t("pleaseLogin")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("noSession")}</p>
          <Button className="mt-5" onClick={() => (window.location.href = "/")}>{t("goHome")}</Button>
        </div>
      </div>
    );
  }

  if (requiredRole && role && role !== requiredRole) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold">{t("wrongAccount")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("wrongAccountText")}</p>
          <Button onClick={signOut} className="mt-5">{t("signOut")}</Button>
        </div>
      </div>
    );
  }

  const translatedTitle = translateNavLabel(title, t);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-card/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <SamaLogo small />
          </Link>

          <nav className="hidden gap-1 md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: "bg-accent text-accent-foreground" }}
              >
                {translateNavLabel(n.label, t)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:block" />
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              {t("signOut")}
            </Button>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto border-t bg-card px-4 py-2 md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {translateNavLabel(n.label, t)}
            </Link>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {title && <h1 className="mb-6 text-3xl font-bold tracking-tight">{translatedTitle}</h1>}
        {children}
      </main>
    </div>
  );
}
