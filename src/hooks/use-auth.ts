import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "patient" | "doctor" | "admin";

async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Role load error:", error);
    return null;
  }

  return (data?.role as AppRole) ?? null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      setLoading(true);

      const { data, error } = await supabase.auth.getSession();

      if (!active) return;

      if (error) {
        console.error("Session load error:", error);
        setSession(null);
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const currentSession = data.session;
      const currentUser = currentSession?.user ?? null;

      setSession(currentSession);
      setUser(currentUser);

      if (currentUser) {
        const currentRole = await getUserRole(currentUser.id);
        if (!active) return;
        setRole(currentRole);
      } else {
        setRole(null);
      }

      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setRole(null);

      if (!newSession?.user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      setTimeout(async () => {
        const currentRole = await getUserRole(newSession.user.id);

        if (!active) return;

        setRole(currentRole);
        setLoading(false);
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return { user, session, role, loading, signOut };
}