import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { N as Newspaper, r as Trash2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const db = supabase;
function DoctorPosts() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [content, setContent] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [status, setStatus] = reactExports.useState("published");
  const [saving, setSaving] = reactExports.useState(false);
  const {
    data: posts
  } = useQuery({
    queryKey: ["doctor-posts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data
      } = await db.from("doctor_posts").select("*").eq("doctor_id", user.id).order("created_at", {
        ascending: false
      });
      return data ?? [];
    }
  });
  const createPost = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !content.trim()) return toast.error("Title and content are required.");
    setSaving(true);
    const {
      error
    } = await db.from("doctor_posts").insert({
      doctor_id: user.id,
      title,
      content,
      image_url: imageUrl || null,
      status
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Post saved");
    setTitle("");
    setContent("");
    setImageUrl("");
    setStatus("published");
    qc.invalidateQueries({
      queryKey: ["doctor-posts"]
    });
  };
  const updateStatus = async (id, nextStatus) => {
    const {
      error
    } = await db.from("doctor_posts").update({
      status: nextStatus,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post updated");
    qc.invalidateQueries({
      queryKey: ["doctor-posts"]
    });
  };
  const removePost = async (id) => {
    const {
      error
    } = await db.from("doctor_posts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    qc.invalidateQueries({
      queryKey: ["doctor-posts"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Doctor Posts" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Share health education, service updates, and professional information. Avoid personal medical advice in public posts." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "mt-1 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Create Post" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Posts appear on your public doctor profile." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: createPost, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Title", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Example: How to manage fever safely" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Content", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 5, value: content, onChange: (e) => setContent(e.target.value), placeholder: "Write a general health education post..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Image URL (optional)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: imageUrl, onChange: (e) => setImageUrl(e.target.value), placeholder: "https://..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: status, onValueChange: (v) => setStatus(v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "published", children: "Published" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hidden", children: "Hidden" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, children: saving ? "Saving..." : "Create post" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "My Posts" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: posts?.length ? posts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsx("article", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          post.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.image_url, alt: "Post", className: "mb-3 max-h-48 w-full rounded-lg object-cover" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: post.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 whitespace-pre-line text-sm text-muted-foreground", children: post.content }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-muted-foreground", children: [
            "Status: ",
            post.status,
            " · ",
            new Date(post.created_at).toLocaleString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: post.status, onValueChange: (v) => updateStatus(post.id, v), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-32", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "published", children: "Published" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "draft", children: "Draft" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "hidden", children: "Hidden" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: () => removePost(post.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }) }, post.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No posts yet." }) })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    children
  ] });
}
export {
  DoctorPosts as component
};
