import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/admin/users")({ component: AdminUsers });

function AdminUsers() {
  const { data } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profs } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const rm = new Map<string, string[]>();
      (roles ?? []).forEach((r) => { const arr = rm.get(r.user_id) ?? []; arr.push(r.role); rm.set(r.user_id, arr); });
      return (profs ?? []).map((p) => ({ ...p, roles: rm.get(p.id) ?? [] }));
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Users</h1>
      <Card><CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-xs uppercase text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">Name</th><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-left">Roles</th><th className="px-4 py-3 text-left">Joined</th></tr>
            </thead>
            <tbody>
              {(data ?? []).map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{u.full_name || "—"}</td>
                  <td className="px-4 py-3">{u.email || "—"}</td>
                  <td className="px-4 py-3">{u.phone || "—"}</td>
                  <td className="px-4 py-3"><div className="flex gap-1">{u.roles.map((r: string) => <span key={r} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">{r}</span>)}</div></td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent></Card>
    </div>
  );
}

