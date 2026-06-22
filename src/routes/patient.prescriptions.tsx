import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/patient/prescriptions")({
  component: PatientPrescriptions,
});

function PatientPrescriptions() {
  const { user } = useAuth();
  const { data: items } = useQuery({
    queryKey: ["patient-rx", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("patient_id", user!.id)
        .order("created_at", { ascending: false });
      if (!data?.length) return [];
      const docIds = [...new Set(data.map((d) => d.doctor_id))];
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", docIds);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return data.map((r) => ({ ...r, doctor_profile: m.get(r.doctor_id) }));
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Prescriptions</h1>
        <p className="text-muted-foreground">All visit summaries and prescriptions.</p>
      </div>
      {!items?.length ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No prescriptions yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="p-5">
                <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
                <div className="mt-1 font-semibold">Dr. {r.doctor_profile?.full_name || "—"}</div>
                <div className="mt-2 text-sm"><span className="font-medium">Diagnosis:</span> {r.diagnosis}</div>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/prescription/$id" params={{ id: r.appointment_id }}>View full summary</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
