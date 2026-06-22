import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Send } from "lucide-react";

export const Route = createFileRoute("/admin/care-coordination")({
  component: AdminCareCoordination,
});

const db = supabase as any;
type RequestStatus = "sent" | "reviewed" | "completed";

function AdminCareCoordination() {
  const qc = useQueryClient();
  const { data: requests } = useQuery({
    queryKey: ["admin-partner-messages"],
    queryFn: async () => {
      const { data } = await db.from("partner_messages").select("*").order("created_at", { ascending: false });
      if (!data?.length) return [];
      const ids = [...new Set(data.flatMap((r: any) => [r.doctor_id, r.patient_id]).filter(Boolean))];
      const { data: profiles } = await db.from("profiles").select("id, full_name, email").in("id", ids);
      const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return data.map((r: any) => ({ ...r, doctor: map.get(r.doctor_id), patient: map.get(r.patient_id) }));
    },
  });

  const updateStatus = async (id: string, status: RequestStatus) => {
    const { error } = await db.from("partner_messages").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Request updated");
    qc.invalidateQueries({ queryKey: ["admin-partner-messages"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Care Coordination Requests</h1>
        <p className="text-muted-foreground">Admin view for doctor requests to labs, pharmacy, clinics, admin, and other doctors.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2"><Send className="h-5 w-5" /><CardTitle>All Requests</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {requests?.length ? requests.map((request: any) => (
            <div key={request.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-semibold capitalize">{request.partner_type.replace("_", " ")} {request.partner_name ? `· ${request.partner_name}` : ""}</div>
                  <div className="text-xs text-muted-foreground">Doctor: {request.doctor?.full_name || request.doctor?.email || "Doctor"} · Patient: {request.patient?.full_name || "General"} · {new Date(request.created_at).toLocaleString()}</div>
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{request.message}</p>
                </div>
                <Select value={request.status} onValueChange={(v) => updateStatus(request.id, v as RequestStatus)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="sent">Sent</SelectItem><SelectItem value="reviewed">Reviewed</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">No requests yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

