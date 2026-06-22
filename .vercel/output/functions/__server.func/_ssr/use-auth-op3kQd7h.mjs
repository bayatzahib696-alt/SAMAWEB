import { r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
function useAuth() {
  const [user, setUser] = reactExports.useState(null);
  const [session, setSession] = reactExports.useState(null);
  const [role, setRole] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        setTimeout(async () => {
          const { data } = await supabase.from("user_roles").select("role").eq("user_id", s.user.id).limit(1).maybeSingle();
          setRole(data?.role ?? null);
        }, 0);
      } else {
        setRole(null);
      }
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).limit(1).maybeSingle();
        setRole(r?.role ?? null);
      }
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return { user, session, role, loading, signOut };
}
export {
  useAuth as u
};
