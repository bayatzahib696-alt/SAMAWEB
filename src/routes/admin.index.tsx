import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Stethoscope, Clock, Calendar, Wallet, Newspaper, Star, Send } from "lucide-react";
import { fmtAFN, statusColor } from "@/lib/constants";

export const Route = createFileRoute("/admin/")({ component: AdminDash });

function AdminDash() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const db = supabase as any;
      const [pats, docs, pend, appts, pays, recent, posts, reviews, requests] = await Promise.all([
        db.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "patient"),
        db.from("doctors").select("*", { count: "exact", head: true }).eq("status", "approved"),
        db.from("doctors").select("*", { count: "exact", head: true }).eq("status", "pending"),
        db.from("appointments").select("*", { count: "exact", head: true }),
        db.from("payments").select("amount,status"),
        db.from("appointments").select("*").order("created_at", { ascending: false }).limit(8),
        db.from("doctor_posts").select("*", { count: "exact", head: true }),
        db.from("doctor_reviews").select("*", { count: "exact", head: true }),
        db.from("partner_messages").select("*", { count: "exact", head: true }).eq("status", "sent"),
      ]);
      const paid = (pays.data ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
      let recentEnriched: any[] = recent.data ?? [];
      if (recentEnriched.length) {
        const ids = [...new Set(recentEnriched.flatMap((a) => [a.patient_id, a.doctor_id]))];
        const { data: profs } = await db.from("profiles").select("id, full_name").in("id", ids);
        const m = new Map((profs ?? []).map((p) => [p.id, p]));
        recentEnriched = recentEnriched.map((a) => ({ ...a, patient: m.get(a.patient_id), doctor: m.get(a.doctor_id) }));
      }
      return {
        patients: pats.count ?? 0,
        doctors: docs.count ?? 0,
        pending: pend.count ?? 0,
        appts: appts.count ?? 0,
        paid,
        recent: recentEnriched,
        posts: posts.count ?? 0,
        reviews: reviews.count ?? 0,
        requests: requests.count ?? 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Patients" value={data?.patients ?? 0} />
        <Stat icon={Stethoscope} label="Approved Doctors" value={data?.doctors ?? 0} />
        <Stat icon={Clock} label="Pending Doctors" value={data?.pending ?? 0} />
        <Stat icon={Calendar} label="Appointments" value={data?.appts ?? 0} />
        <Stat icon={Wallet} label="Revenue" value={fmtAFN(data?.paid ?? 0)} />
        <Stat icon={Newspaper} label="Doctor Posts" value={data?.posts ?? 0} />
        <Stat icon={Star} label="Reviews" value={data?.reviews ?? 0} />
        <Stat icon={Send} label="Open Care Requests" value={data?.requests ?? 0} />
      </div>
      <Card>
        <CardHeader><CardTitle>Recent Appointments</CardTitle></CardHeader>
        <CardContent>
          {!data?.recent?.length ? <p className="py-6 text-center text-sm text-muted-foreground">No appointments yet.</p> : (
            <ul className="divide-y">
              {data.recent.map((a: any) => (
                <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <div className="font-medium">{a.patient?.full_name || "—"} → Dr. {a.doctor?.full_name || "—"}</div>
                    <div className="text-xs text-muted-foreground">{a.appointment_date} {a.appointment_time?.toString().slice(0,5)}</div>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${statusColor[a.status]}`}>{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) {
  return (
    <Card><CardContent className="flex items-center gap-3 p-5">
      <div className="grid h-11 w-11 place-items-center rounded-lg gradient-medical"><Icon className="h-5 w-5 text-primary-foreground" /></div>
      <div><div className="text-xl font-bold">{value}</div><div className="text-xs text-muted-foreground">{label}</div></div>
    </CardContent></Card>
  );
}

