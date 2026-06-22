import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Newspaper, Trash2 } from "lucide-react";

export const Route = createFileRoute("/doctor/posts")({
  component: DoctorPosts,
});

const db = supabase as any;

type PostStatus = "draft" | "published" | "hidden";

function DoctorPosts() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [status, setStatus] = useState<PostStatus>("published");
  const [saving, setSaving] = useState(false);

  const { data: posts } = useQuery({
    queryKey: ["doctor-posts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await db.from("doctor_posts").select("*").eq("doctor_id", user!.id).order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required.");
    setSaving(true);
    const { error } = await db.from("doctor_posts").insert({
      doctor_id: user.id,
      title,
      content,
      image_url: imageUrl || null,
      status,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Post saved");
    setTitle("");
    setContent("");
    setImageUrl("");
    setStatus("published");
    qc.invalidateQueries({ queryKey: ["doctor-posts"] });
  };

  const updateStatus = async (id: string, nextStatus: PostStatus) => {
    const { error } = await db.from("doctor_posts").update({ status: nextStatus, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post updated");
    qc.invalidateQueries({ queryKey: ["doctor-posts"] });
  };

  const removePost = async (id: string) => {
    const { error } = await db.from("doctor_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    qc.invalidateQueries({ queryKey: ["doctor-posts"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doctor Posts</h1>
        <p className="text-muted-foreground">Share health education, service updates, and professional information. Avoid personal medical advice in public posts.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start gap-3">
          <Newspaper className="mt-1 h-5 w-5 text-primary" />
          <div><CardTitle>Create Post</CardTitle><CardDescription>Posts appear on your public doctor profile.</CardDescription></div>
        </CardHeader>
        <CardContent>
          <form onSubmit={createPost} className="space-y-4">
            <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: How to manage fever safely" /></Field>
            <Field label="Content"><Textarea rows={5} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write a general health education post..." /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Image URL (optional)"><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." /></Field>
              <Field label="Status"><Select value={status} onValueChange={(v) => setStatus(v as PostStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="hidden">Hidden</SelectItem></SelectContent></Select></Field>
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create post"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>My Posts</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {posts?.length ? posts.map((post: any) => (
            <article key={post.id} className="rounded-xl border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  {post.image_url && <img src={post.image_url} alt="Post" className="mb-3 max-h-48 w-full rounded-lg object-cover" />}
                  <h3 className="font-semibold">{post.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{post.content}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Status: {post.status} · {new Date(post.created_at).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Select value={post.status} onValueChange={(v) => updateStatus(post.id, v as PostStatus)}>
                    <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="published">Published</SelectItem><SelectItem value="draft">Draft</SelectItem><SelectItem value="hidden">Hidden</SelectItem></SelectContent>
                  </Select>
                  <Button size="icon" variant="outline" onClick={() => removePost(post.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </article>
          )) : <p className="text-sm text-muted-foreground">No posts yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
