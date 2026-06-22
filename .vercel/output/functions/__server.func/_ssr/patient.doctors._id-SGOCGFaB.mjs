import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-DCDRzI6q.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { f as fmtAFN } from "./constants-BMfp__yZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { b as Route$2 } from "./router-Dtls9AFd.mjs";
import { A as ArrowLeft, S as Stethoscope, B as Building2, h as Star, s as Award, d as Clock, n as Languages, G as GraduationCap, N as Newspaper } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
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
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
const db = supabase;
function DoctorProfile() {
  const {
    id
  } = Route$2.useParams();
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [rating, setRating] = reactExports.useState(5);
  const [reviewText, setReviewText] = reactExports.useState("");
  const [savingReview, setSavingReview] = reactExports.useState(false);
  const {
    data: doctor,
    isLoading,
    error
  } = useQuery({
    queryKey: ["doctor-profile-page", id],
    queryFn: async () => {
      let doctorRow = null;
      const byDoctorId = await db.from("doctors").select("*").eq("id", id).maybeSingle();
      if (byDoctorId.error) {
        console.error("Doctor lookup by id error:", byDoctorId.error);
      }
      if (byDoctorId.data) {
        doctorRow = byDoctorId.data;
      }
      if (!doctorRow) {
        const byUserId = await db.from("doctors").select("*").eq("user_id", id).maybeSingle();
        if (byUserId.error) {
          console.error("Doctor lookup by user_id error:", byUserId.error);
        }
        if (byUserId.data) {
          doctorRow = byUserId.data;
        }
      }
      if (!doctorRow) {
        return null;
      }
      const {
        data: profile
      } = await db.from("profiles").select("*").eq("id", doctorRow.user_id).maybeSingle();
      const {
        data: posts
      } = await db.from("doctor_posts").select("*").eq("doctor_id", doctorRow.user_id).eq("status", "published").order("created_at", {
        ascending: false
      });
      const {
        data: reviews
      } = await db.from("doctor_reviews").select("*").eq("doctor_id", doctorRow.user_id).order("created_at", {
        ascending: false
      });
      const patientIds = [...new Set((reviews ?? []).map((r) => r.patient_id).filter(Boolean))];
      const {
        data: patientProfiles
      } = patientIds.length ? await db.from("profiles").select("id, full_name").in("id", patientIds) : {
        data: []
      };
      const patientMap = new Map((patientProfiles ?? []).map((p) => [p.id, p]));
      return {
        ...doctorRow,
        profile,
        posts: posts ?? [],
        reviews: (reviews ?? []).map((r) => ({
          ...r,
          patient: patientMap.get(r.patient_id)
        }))
      };
    }
  });
  const {
    data: reviewEligibility
  } = useQuery({
    queryKey: ["review-eligibility", id, user?.id, doctor?.user_id],
    enabled: !!user && !!doctor?.user_id,
    queryFn: async () => {
      const {
        data: appointments
      } = await db.from("appointments").select("*").eq("patient_id", user.id).eq("doctor_id", doctor.user_id).eq("status", "completed").order("created_at", {
        ascending: false
      });
      if (!appointments?.length) {
        return {
          appointment: null,
          alreadyReviewed: false
        };
      }
      const ids = appointments.map((a) => a.id);
      const {
        data: reviews
      } = await db.from("doctor_reviews").select("appointment_id").in("appointment_id", ids);
      const reviewed = new Set((reviews ?? []).map((r) => r.appointment_id));
      const appointment = appointments.find((a) => !reviewed.has(a.id)) ?? null;
      return {
        appointment,
        alreadyReviewed: !appointment
      };
    }
  });
  const averageRating = reactExports.useMemo(() => {
    const reviews = doctor?.reviews ?? [];
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => {
      return sum + Number(r.rating || 0);
    }, 0) / reviews.length;
  }, [doctor?.reviews]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-muted-foreground", children: "Loading doctor profile..." });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive", children: "Could not load doctor profile." });
  }
  if (!doctor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Doctor not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/patient/doctors", children: "Back to doctors" }) })
    ] });
  }
  const bannerUrl = doctor.banner_url || doctor.banner_image_url;
  const doctorName = doctor.profile?.full_name || "Doctor";
  const availabilityText = doctor.availability || doctor.availability_text || "";
  const slots = availabilityText ? availabilityText.split(",").map((s) => s.trim()).filter(Boolean) : ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
  const languages = Array.isArray(doctor.languages) ? doctor.languages.join(", ") : doctor.languages || "Dari";
  const submitReview = async (e) => {
    e.preventDefault();
    if (!user || !reviewEligibility?.appointment) {
      return toast.error("You can review this doctor after a completed appointment.");
    }
    setSavingReview(true);
    const {
      error: error2
    } = await db.from("doctor_reviews").insert({
      doctor_id: doctor.user_id,
      patient_id: user.id,
      appointment_id: reviewEligibility.appointment.id,
      rating,
      review_text: reviewText || null
    });
    setSavingReview(false);
    if (error2) {
      return toast.error(error2.message);
    }
    toast.success("Review submitted");
    setReviewText("");
    qc.invalidateQueries({
      queryKey: ["doctor-profile-page", id]
    });
    qc.invalidateQueries({
      queryKey: ["review-eligibility", id, user?.id, doctor?.user_id]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/patient/doctors", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      "Back to doctors"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 bg-gradient-to-r from-primary/90 via-primary/70 to-accent", children: bannerUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bannerUrl, alt: "Doctor banner", className: "h-full w-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "-mt-16 flex flex-col gap-6 sm:flex-row sm:items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-background gradient-medical text-4xl font-bold text-primary-foreground shadow-lg", children: doctor.profile_photo_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: doctor.profile_photo_url, alt: "Doctor", className: "h-full w-full object-cover" }) : doctorName.charAt(0) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 pt-12 sm:pt-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold", children: [
              "Dr. ",
              doctorName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-full px-2 py-0.5 text-xs font-medium ${doctor.is_online ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`, children: doctor.is_online ? "Online" : "Offline" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-3 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-4 w-4" }),
              doctor.specialty || "General Physician"
            ] }),
            doctor.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-4 w-4" }),
              doctor.city
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-current text-warning" }),
              averageRating ? averageRating.toFixed(1) : "New",
              " (",
              doctor.reviews?.length || 0,
              " reviews)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid gap-3 sm:grid-cols-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Award, label: "Experience", value: `${doctor.years_experience || 0} years` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: "Consultation", value: "~30 min" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Stethoscope, label: "Fee", value: fmtAFN(doctor.consultation_fee || 0) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Languages, label: "Languages", value: languages })
          ] }),
          doctor.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: doctor.bio })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Professional Background" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: GraduationCap, label: "Education", value: doctor.education || "Not added yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { icon: Building2, label: "Clinic / Hospital", value: doctor.clinic_name || "Online consultation" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Doctor Posts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: doctor.posts?.length ? doctor.posts.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-xl border p-4", children: [
            post.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.image_url, alt: "Post", className: "mb-3 max-h-52 w-full rounded-lg object-cover" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: post.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 whitespace-pre-line text-sm text-muted-foreground", children: post.content })
          ] }, post.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No doctor posts yet." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Patient Reviews" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4", children: doctor.reviews?.length ? doctor.reviews.map((review) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: review.patient?.full_name || "Patient" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 text-warning", children: Array.from({
                length: Number(review.rating || 0)
              }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 fill-current" }, i)) })
            ] }),
            review.review_text && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: review.review_text })
          ] }, review.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No reviews yet." }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Available Time Slots" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: slots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border bg-secondary px-3 py-2 text-center text-sm font-medium", children: s }, s)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", className: "mt-6 w-full", onClick: () => {
              window.location.href = `/patient/book/${doctor.id}`;
            }, children: "Book Appointment" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Rate this Doctor" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: reviewEligibility?.appointment ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: submitReview, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Rating" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex gap-1", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setRating(n), className: "text-warning", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-6 w-6 ${n <= rating ? "fill-current" : ""}` }) }, n)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Review" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: reviewText, onChange: (e) => setReviewText(e.target.value), placeholder: "Write a short review..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: savingReview, className: "w-full", children: savingReview ? "Saving..." : "Submit review" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You can rate this doctor after a completed appointment." }) })
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-background p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 line-clamp-2 font-semibold", children: value })
  ] });
}
function Info({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-background p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-medium", children: value })
  ] });
}
export {
  DoctorProfile as component
};
