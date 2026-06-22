import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { statusColor } from "@/lib/constants";

export const Route = createFileRoute("/admin/appointments")({ component: AdminAppts });

function AdminAppts() {
  const { data } = useQuery({
    queryKey: ["admin-appts"],
    queryFn: async () => {
      const { data: a } = await supabase.from("appointments").select("*").order("created_at", { ascending: false });
      if (!a?.length) return [];
      const ids = [...new Set(a.flatMap((x) => [x.patient_id, x.doctor_id]))];
      const { data: p } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const m = new Map((p ?? []).map((x) => [x.id, x]));
      return a.map((x) => ({ ...x, patient: m.get(x.patient_id), doctor: m.get(x.doctor_id) }));
    },
  });
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-secondary text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Doctor</th><th className="px-4 py-3 text-left">When</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
        <tbody>{(data ?? []).map((a: any) => (
          <tr key={a.id} className="border-t">
            <td className="px-4 py-3">{a.patient?.full_name || "—"}</td>
            <td className="px-4 py-3">Dr. {a.doctor?.full_name || "—"}</td>
            <td className="px-4 py-3">{a.appointment_date} {a.appointment_time?.toString().slice(0,5)}</td>
            <td className="px-4 py-3"><span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${statusColor[a.status]}`}>{a.status}</span></td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </div>
  );
}

