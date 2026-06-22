import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Star, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

const db = supabase as any;

function AdminReviews() {
  const qc = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data } = await db.from("doctor_reviews").select("*").order("created_at", { ascending: false });
      if (!data?.length) return [];
      const ids = [...new Set(data.flatMap((r: any) => [r.doctor_id, r.patient_id]))];
      const { data: profiles } = await db.from("profiles").select("id, full_name, email").in("id", ids);
      const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return data.map((r: any) => ({ ...r, doctor: map.get(r.doctor_id), patient: map.get(r.patient_id) }));
    },
  });

  const remove = async (id: string) => {
    const { error } = await db.from("doctor_reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review removed");
    qc.invalidateQueries({ queryKey: ["admin-reviews"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Reviews</h1>
        <p className="text-muted-foreground">Monitor ratings and remove inappropriate reviews.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>All Reviews</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {reviews?.length ? reviews.map((review: any) => (
            <div key={review.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="font-semibold">Dr. {review.doctor?.full_name || review.doctor?.email || "Doctor"}</div>
                  <div className="text-xs text-muted-foreground">Patient: {review.patient?.full_name || review.patient?.email || "Patient"} · {new Date(review.created_at).toLocaleString()}</div>
                  <div className="mt-2 flex items-center gap-1 text-warning">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                  {review.review_text && <p className="mt-2 text-sm text-muted-foreground">{review.review_text}</p>}
                </div>
                <Button size="icon" variant="outline" onClick={() => remove(review.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          )) : <p className="text-sm text-muted-foreground">No reviews yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

