import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export type AppRole = "patient" | "doctor" | "admin";

const ROLE_KEY = "sama_role";
const USER_KEY = "sama_user_id";

function getStoredRole(): AppRole | null {
  if (typeof window === "undefined") return null;

  const role = window.localStorage.getItem(ROLE_KEY);

  if (role === "patient" || role === "doctor" || role === "admin") {
    return role;
  }

  return null;
}

function saveStoredRole(role: AppRole | null, userId?: string) {
  if (typeof window === "undefined") return;

  if (role) {
    window.localStorage.setItem(ROLE_KEY, role);
  } else {
    window.localStorage.removeItem(ROLE_KEY);
  }

  if (userId) {
    window.localStorage.setItem(USER_KEY, userId);
  } else if (!role) {
    window.localStorage.removeItem(USER_KEY);
  }
}

function clearStoredAuth() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(USER_KEY);
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms = 12000,
  message = "Request timed out"
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data, error } = await withTimeout(
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle(),
    12000,
    "Role check timed out"
  );

  if (error) {
    console.error("Role load error:", error);
    return null;
  }

  const role = data?.role;

  if (role === "patient" || role === "doctor" || role === "admin") {
    saveStoredRole(role, userId);
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
    let active = true;

    async function loadAuth() {
      setLoading(true);

      try {
        const { data, error } = await withTimeout(
          supabase.auth.getSession(),
          12000,
          "Session check timed out"
        );

        if (!active) return;

        if (error) {
          console.error("Session error:", error);
          setSession(null);
          setUser(null);
          setRole(null);
          clearStoredAuth();
          setLoading(false);
          return;
        }

        const currentSession = data.session;
        const currentUser = currentSession?.user ?? null;

        setSession(currentSession);
        setUser(currentUser);

        if (!currentUser) {
          setRole(null);
          clearStoredAuth();
          setLoading(false);
          return;
        }

        const storedRole = getStoredRole();

        if (storedRole) {
          setRole(storedRole);
          setLoading(false);

          getUserRole(currentUser.id).then((freshRole) => {
            if (!active) return;
            if (freshRole) setRole(freshRole);
          });

          return;
        }

        const freshRole = await getUserRole(currentUser.id);

        if (!active) return;

        setRole(freshRole);
        setLoading(false);
      } catch (err) {
        console.error("Auth load crash:", err);
        if (!active) return;

        setSession(null);
        setUser(null);
        setRole(null);
        clearStoredAuth();
        setLoading(false);
      }
    }

    loadAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setRole(null);
        clearStoredAuth();
        setLoading(false);
        return;
      }

      const storedRole = getStoredRole();

      if (storedRole) {
        setRole(storedRole);
        setLoading(false);
      } else {
        setLoading(true);
      }

      setTimeout(async () => {
        try {
          const freshRole = await getUserRole(newSession.user.id);

          if (!active) return;

          setRole(freshRole);
          setLoading(false);
        } catch (err) {
          console.error("Auth state role crash:", err);
          if (!active) return;
          setLoading(false);
        }
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    clearStoredAuth();
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