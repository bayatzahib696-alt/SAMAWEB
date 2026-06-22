import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DCDRzI6q.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { h as Star, r as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
const db = supabase;
function AdminReviews() {
  const qc = useQueryClient();
  const {
    data: reviews
  } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const {
        data
      } = await db.from("doctor_reviews").select("*").order("created_at", {
        ascending: false
      });
      if (!data?.length) return [];
      const ids = [...new Set(data.flatMap((r) => [r.doctor_id, r.patient_id]))];
      const {
        data: profiles
      } = await db.from("profiles").select("id, full_name, email").in("id", ids);
      const map = new Map((profiles ?? []).map((p) => [p.id, p]));
      return data.map((r) => ({
        ...r,
        doctor: map.get(r.doctor_id),
        patient: map.get(r.patient_id)
      }));
    }
  });
  const remove = async (id) => {
    const {
      error
    } = await db.from("doctor_reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review removed");
    qc.invalidateQueries({
      queryKey: ["admin-reviews"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Doctor Reviews" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Monitor ratings and remove inappropriate reviews." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "All Reviews" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: reviews?.length ? reviews.map((review) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
            "Dr. ",
            review.doctor?.full_name || review.doctor?.email || "Doctor"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
            "Patient: ",
            review.patient?.full_name || review.patient?.email || "Patient",
            " · ",
            new Date(review.created_at).toLocaleString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex items-center gap-1 text-warning", children: Array.from({
            length: review.rating
          }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-current" }, i)) }),
          review.review_text && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: review.review_text })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "outline", onClick: () => remove(review.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }) }, review.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No reviews yet." }) })
    ] })
  ] });
}
export {
  AdminReviews as component
};
