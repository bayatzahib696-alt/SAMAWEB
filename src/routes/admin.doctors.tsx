import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fmtAFN } from "@/lib/constants";
import { Check, X } from "lucide-react";

export const Route = createFileRoute("/admin/doctors")({ component: AdminDoctors });

function AdminDoctors() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-docs"],
    queryFn: async () => {
      const { data: docs } = await supabase.from("doctors").select("*").order("created_at", { ascending: false });
      if (!docs?.length) return [];
      const ids = docs.map((d) => d.user_id);
      const { data: profs } = await supabase.from("profiles").select("id, full_name, email, phone").in("id", ids);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return docs.map((d) => ({ ...d, profile: m.get(d.user_id) }));
    },
  });

  const setStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("doctors").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Doctor ${status}`);
    qc.invalidateQueries({ queryKey: ["admin-docs"] });
  };

  const pending = (data ?? []).filter((d: any) => d.status === "pending");
  const others = (data ?? []).filter((d: any) => d.status !== "pending");

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Doctor Approvals</h1><p className="text-muted-foreground">Review and approve doctor accounts.</p></div>
      <section>
        <h2 className="mb-2 text-lg font-semibold">Pending ({pending.length})</h2>
        <div className="space-y-3">
          {pending.length === 0 && <p className="text-sm text-muted-foreground">No pending doctors.</p>}
          {pending.map((d: any) => <DocRow key={d.id} d={d} onApprove={() => setStatus(d.id, "approved")} onReject={() => setStatus(d.id, "rejected")} />)}
        </div>
      </section>
      <section>
        <h2 className="mb-2 text-lg font-semibold">All Doctors</h2>
        <div className="space-y-3">
          {others.map((d: any) => <DocRow key={d.id} d={d} />)}
        </div>
      </section>
    </div>
  );
}

function DocRow({ d, onApprove, onReject }: { d: any; onApprove?: () => void; onReject?: () => void }) {
  return (
    <Card><CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-semibold">Dr. {d.profile?.full_name || "—"} <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs capitalize">{d.status}</span></div>
        <div className="text-xs text-muted-foreground">{d.specialty} · License {d.license_number} · {d.years_experience}y · {fmtAFN(d.consultation_fee)}</div>
        <div className="text-xs text-muted-foreground">{d.profile?.email} · {d.profile?.phone}</div>
      </div>
      {onApprove && (
        <div className="flex gap-2">
          <Button size="sm" onClick={onApprove}><Check className="mr-1 h-4 w-4" /> Approve</Button>
          <Button size="sm" variant="outline" onClick={onReject}><X className="mr-1 h-4 w-4" /> Reject</Button>
        </div>
      )}
    </CardContent></Card>
  );
}

