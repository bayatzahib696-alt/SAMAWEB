import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Newspaper, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPosts,
});

const db = supabase as any;
type PostStatus = "draft" | "published" | "hidden";

function AdminPosts() {
  const qc = useQueryClient();
  const { data: posts } = useQuery({
    queryKey: ["admin-doctor-posts"],
    queryFn: async () => {
      const { data } = await db.from("doctor_posts").select("*").order("created_at", { ascending: false });
      if (!data?.length) return [];
      const doctorIds = [...new Set(data.map((p: any) => p.doctor_id))];
      const { data: profiles } = await db.from("profiles").select("id, full_name, email").in("id", doctorIds);
      const map = new Map((profiles ?? []).map((p: any) => [p.id, p]));
      return data.map((p: any) => ({ ...p, doctor: map.get(p.doctor_id) }));
    },
  });

  const updateStatus = async (id: string, status: PostStatus) => {
    const { error } = await db.from("doctor_posts").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post status updated");
    qc.invalidateQueries({ queryKey: ["admin-doctor-posts"] });
  };

  const remove = async (id: string) => {
    const { error } = await db.from("doctor_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post removed");
    qc.invalidateQueries({ queryKey: ["admin-doctor-posts"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Posts</h1>
        <p className="text-muted-foreground">Review and hide doctor public health education posts.</p>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-2"><Newspaper className="h-5 w-5" /><CardTitle>All Posts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {posts?.length ? posts.map((post: any) => (
            <article key={post.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground">Dr. {post.doctor?.full_name || post.doctor?.email || "Doctor"} · {new Date(post.created_at).toLocaleString()}</div>
                  {post.image_url && <img src={post.image_url} alt="Post" className="my-3 max-h-48 w-full rounded-lg object-cover" />}
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{post.content}</p>
                </div>
                <div className="flex gap-2">
                  <Select value={post.status} onValueChange={(v) => updateStatus(post.id, v as PostStatus)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="hidden">Hidden</SelectItem></SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={() => remove(post.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </article>
          )) : <p className="text-sm text-muted-foreground">No posts yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

