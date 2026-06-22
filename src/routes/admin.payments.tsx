import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { fmtAFN, statusColor } from "@/lib/constants";

export const Route = createFileRoute("/admin/payments")({ component: AdminPayments });

function AdminPayments() {
  const { data } = useQuery({
    queryKey: ["admin-pay"],
    queryFn: async () => {
      const { data: p } = await supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (!p?.length) return [];
      const ids = [...new Set(p.flatMap((x) => [x.patient_id, x.doctor_id]))];
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", ids);
      const m = new Map((profs ?? []).map((x) => [x.id, x]));
      return p.map((x) => ({ ...x, patient: m.get(x.patient_id), doctor: m.get(x.doctor_id) }));
    },
  });
  const total = (data ?? []).filter((p: any) => p.status === "paid").reduce((s: number, p: any) => s + Number(p.amount), 0);
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <div className="text-right"><div className="text-xs text-muted-foreground">Total revenue</div><div className="text-2xl font-bold">{fmtAFN(total)}</div></div>
      </div>
      <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm">
        <thead className="bg-secondary text-xs uppercase text-muted-foreground"><tr><th className="px-4 py-3 text-left">Patient</th><th className="px-4 py-3 text-left">Doctor</th><th className="px-4 py-3 text-left">Amount</th><th className="px-4 py-3 text-left">Method</th><th className="px-4 py-3 text-left">Status</th></tr></thead>
        <tbody>{(data ?? []).map((p: any) => (
          <tr key={p.id} className="border-t">
            <td className="px-4 py-3">{p.patient?.full_name || "—"}</td>
            <td className="px-4 py-3">Dr. {p.doctor?.full_name || "—"}</td>
            <td className="px-4 py-3 font-medium">{fmtAFN(p.amount)}</td>
            <td className="px-4 py-3 capitalize">{p.payment_method || "—"}</td>
            <td className="px-4 py-3"><span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${statusColor[p.status]}`}>{p.status}</span></td>
          </tr>
        ))}</tbody>
      </table></div></CardContent></Card>
    </div>
  );
}

