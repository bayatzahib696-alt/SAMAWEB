import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fmtAFN } from "@/lib/constants";
import {
  ArrowLeft,
  Clock,
  Award,
  Stethoscope,
  Star,
  Languages,
  Building2,
  GraduationCap,
  Newspaper,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/patient/doctors/$id")({
  component: DoctorProfile,
});

const db = supabase as any;

function DoctorProfile() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  const {
    data: doctor,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctor-profile-page", id],
    queryFn: async () => {
      let doctorRow: any = null;

      const byDoctorId = await db
        .from("doctors")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (byDoctorId.error) {
        console.error("Doctor lookup by id error:", byDoctorId.error);
      }

      if (byDoctorId.data) {
        doctorRow = byDoctorId.data;
      }

      if (!doctorRow) {
        const byUserId = await db
          .from("doctors")
          .select("*")
          .eq("user_id", id)
          .maybeSingle();

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

      const { data: profile } = await db
        .from("profiles")
        .select("*")
        .eq("id", doctorRow.user_id)
        .maybeSingle();

      const { data: posts } = await db
        .from("doctor_posts")
        .select("*")
        .eq("doctor_id", doctorRow.user_id)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      const { data: reviews } = await db
        .from("doctor_reviews")
        .select("*")
        .eq("doctor_id", doctorRow.user_id)
        .order("created_at", { ascending: false });

      const patientIds = [
        ...new Set(
          (reviews ?? []).map((r: any) => r.patient_id).filter(Boolean)
        ),
      ];

      const { data: patientProfiles } = patientIds.length
        ? await db
            .from("profiles")
            .select("id, full_name")
            .in("id", patientIds)
        : { data: [] };

      const patientMap = new Map(
        (patientProfiles ?? []).map((p: any) => [p.id, p])
      );

      return {
        ...doctorRow,
        profile,
        posts: posts ?? [],
        reviews: (reviews ?? []).map((r: any) => ({
          ...r,
          patient: patientMap.get(r.patient_id),
        })),
      };
    },
  });

  const { data: reviewEligibility } = useQuery({
    queryKey: ["review-eligibility", id, user?.id, doctor?.user_id],
    enabled: !!user && !!doctor?.user_id,
    queryFn: async () => {
      const { data: appointments } = await db
        .from("appointments")
        .select("*")
        .eq("patient_id", user!.id)
        .eq("doctor_id", doctor.user_id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (!appointments?.length) {
        return { appointment: null, alreadyReviewed: false };
      }

      const ids = appointments.map((a: any) => a.id);

      const { data: reviews } = await db
        .from("doctor_reviews")
        .select("appointment_id")
        .in("appointment_id", ids);

      const reviewed = new Set(
        (reviews ?? []).map((r: any) => r.appointment_id)
      );

      const appointment =
        appointments.find((a: any) => !reviewed.has(a.id)) ?? null;

      return {
        appointment,
        alreadyReviewed: !appointment,
      };
    },
  });

  const averageRating = useMemo(() => {
    const reviews = doctor?.reviews ?? [];

    if (!reviews.length) return 0;

    return (
      reviews.reduce((sum: number, r: any) => {
        return sum + Number(r.rating || 0);
      }, 0) / reviews.length
    );
  }, [doctor?.reviews]);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading doctor profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
        Could not load doctor profile.
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">Doctor not found.</p>
        <Button asChild>
          <Link to="/patient/doctors">Back to doctors</Link>
        </Button>
      </div>
    );
  }

  const bannerUrl = doctor.banner_url || doctor.banner_image_url;
  const doctorName = doctor.profile?.full_name || "Doctor";

  const availabilityText =
    doctor.availability || doctor.availability_text || "";

  const slots = availabilityText
    ? availabilityText
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)
    : ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

  const languages = Array.isArray(doctor.languages)
    ? doctor.languages.join(", ")
    : doctor.languages || "Dari";

  const submitReview = async (e: FormEvent) => {
    e.preventDefault();

    if (!user || !reviewEligibility?.appointment) {
      return toast.error(
        "You can review this doctor after a completed appointment."
      );
    }

    setSavingReview(true);

    const { error } = await db.from("doctor_reviews").insert({
      doctor_id: doctor.user_id,
      patient_id: user.id,
      appointment_id: reviewEligibility.appointment.id,
      rating,
      review_text: reviewText || null,
    });

    setSavingReview(false);

    if (error) {
      return toast.error(error.message);
    }

    toast.success("Review submitted");
    setReviewText("");

    qc.invalidateQueries({ queryKey: ["doctor-profile-page", id] });
    qc.invalidateQueries({
      queryKey: ["review-eligibility", id, user?.id, doctor?.user_id],
    });
  };

  return (
    <div className="space-y-6">
      <Link
        to="/patient/doctors"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to doctors
      </Link>

      <Card className="overflow-hidden">
        <div className="h-44 bg-gradient-to-r from-primary/90 via-primary/70 to-accent">
          {bannerUrl && (
            <img
              src={bannerUrl}
              alt="Doctor banner"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <CardContent className="p-6">
          <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-3xl border-4 border-background gradient-medical text-4xl font-bold text-primary-foreground shadow-lg">
              {doctor.profile_photo_url ? (
                <img
                  src={doctor.profile_photo_url}
                  alt="Doctor"
                  className="h-full w-full object-cover"
                />
              ) : (
                doctorName.charAt(0)
              )}
            </div>

            <div className="flex-1 pt-12 sm:pt-16">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold">Dr. {doctorName}</h1>

                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    doctor.is_online
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {doctor.is_online ? "Online" : "Offline"}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Stethoscope className="h-4 w-4" />
                  {doctor.specialty || "General Physician"}
                </span>

                {doctor.city && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {doctor.city}
                  </span>
                )}

                <span className="inline-flex items-center gap-1">
                  <Star className="h-4 w-4 fill-current text-warning" />
                  {averageRating ? averageRating.toFixed(1) : "New"} (
                  {doctor.reviews?.length || 0} reviews)
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <Stat
                  icon={Award}
                  label="Experience"
                  value={`${doctor.years_experience || 0} years`}
                />
                <Stat icon={Clock} label="Consultation" value="~30 min" />
                <Stat
                  icon={Stethoscope}
                  label="Fee"
                  value={fmtAFN(doctor.consultation_fee || 0)}
                />
                <Stat icon={Languages} label="Languages" value={languages} />
              </div>

              {doctor.bio && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {doctor.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Professional Background</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Info
                icon={GraduationCap}
                label="Education"
                value={doctor.education || "Not added yet"}
              />

              <Info
                icon={Building2}
                label="Clinic / Hospital"
                value={doctor.clinic_name || "Online consultation"}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <Newspaper className="h-5 w-5" />
              <CardTitle>Doctor Posts</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {doctor.posts?.length ? (
                doctor.posts.map((post: any) => (
                  <article key={post.id} className="rounded-xl border p-4">
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Post"
                        className="mb-3 max-h-52 w-full rounded-lg object-cover"
                      />
                    )}

                    <h3 className="font-semibold">{post.title}</h3>

                    <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">
                      {post.content}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No doctor posts yet.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Reviews</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {doctor.reviews?.length ? (
                doctor.reviews.map((review: any) => (
                  <div key={review.id} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium">
                        {review.patient?.full_name || "Patient"}
                      </div>

                      <div className="flex items-center gap-1 text-warning">
                        {Array.from({
                          length: Number(review.rating || 0),
                        }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    {review.review_text && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.review_text}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Time Slots</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((s: string) => (
                  <div
                    key={s}
                    className="rounded-lg border bg-secondary px-3 py-2 text-center text-sm font-medium"
                  >
                    {s}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                className="mt-6 w-full"
                onClick={() => {
                  window.location.href = `/patient/book/${doctor.id}`;
                }}
              >
                Book Appointment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate this Doctor</CardTitle>
            </CardHeader>

            <CardContent>
              {reviewEligibility?.appointment ? (
                <form onSubmit={submitReview} className="space-y-4">
                  <div>
                    <Label>Rating</Label>

                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setRating(n)}
                          className="text-warning"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              n <= rating ? "fill-current" : ""
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Review</Label>

                    <Textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Write a short review..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={savingReview}
                    className="w-full"
                  >
                    {savingReview ? "Saving..." : "Submit review"}
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You can rate this doctor after a completed appointment.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>

      <div className="mt-1 line-clamp-2 font-semibold">{value}</div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>

      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
