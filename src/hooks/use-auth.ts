import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "patient" | "doctor" | "admin";

const ROLE_KEY = "sama_role";

function getStoredRole(): AppRole | null {
  if (typeof window === "undefined") return null;

  const role = window.localStorage.getItem(ROLE_KEY);

  if (role === "patient" || role === "doctor" || role === "admin") {
    return role;
  }

  return null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(getStoredRole());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadSession() {
      try {
        const { data } = await supabase.auth.getSession();

        if (!alive) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);
        setRole(getStoredRole());
      } catch (error) {
        console.error("Auth session load error:", error);

        if (!alive) return;

        setSession(null);
        setUser(null);
        setRole(null);
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadSession();

    return () => {
      alive = false;
    };
  }, []);

  const signOut = async () => {
    window.localStorage.removeItem(ROLE_KEY);
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return {
    user,
    session,
    role,
    loading,
    signOut,
  };
}