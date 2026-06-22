import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SPECIALTIES, fmtAFN } from "@/lib/constants";
import { Search, Stethoscope, Star, Languages, MapPin } from "lucide-react";

export const Route = createFileRoute("/patient/doctors")({
  component: PatientDoctorsRoute,
});

const db = supabase as any;

function PatientDoctorsRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const cleanPath = pathname.replace(/\/+$/, "");

  if (cleanPath !== "/patient/doctors") {
    return <Outlet />;
  }

  return <FindDoctor />;
}

function FindDoctor() {
  const [q, setQ] = useState("");
  const [spec, setSpec] = useState<string>("all");
  const [city, setCity] = useState<string>("all");
  const [online, setOnline] = useState<string>("all");

  const {
    data: doctors = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors-approved-advanced"],
    queryFn: async () => {
      const { data: docs, error: docsError } = await db
        .from("doctors")
        .select("*")
        .eq("status", "approved");

      if (docsError) {
        console.error("Doctors load error:", docsError);
        throw docsError;
      }

      if (!docs?.length) return [];

      const userIds = docs.map((d: any) => d.user_id).filter(Boolean);
      const uniqueUserIds = Array.from(new Set(userIds));

      const { data: profs } = uniqueUserIds.length
        ? await db
            .from("profiles")
            .select("id, full_name, phone, email")
            .in("id", uniqueUserIds)
        : { data: [] };

      const { data: reviews } = uniqueUserIds.length
        ? await db
            .from("doctor_reviews")
            .select("doctor_id, rating")
            .in("doctor_id", uniqueUserIds)
        : { data: [] };

      const profMap = new Map((profs ?? []).map((p: any) => [p.id, p]));

      const ratingMap = new Map<string, { total: number; count: number }>();

      for (const review of reviews ?? []) {
        const current = ratingMap.get(review.doctor_id) ?? {
          total: 0,
          count: 0,
        };

        current.total += Number(review.rating || 0);
        current.count += 1;

        ratingMap.set(review.doctor_id, current);
      }

      return docs.map((d: any) => {
        const rating = ratingMap.get(d.user_id);

        return {
          ...d,
          profile: profMap.get(d.user_id),
          average_rating: rating?.count ? rating.total / rating.count : 0,
          review_count: rating?.count ?? 0,
        };
      });
    },
  });

  const cities = useMemo(() => {
    const set = new Set(
      (doctors ?? []).map((d: any) => d.city).filter(Boolean)
    );

    return Array.from(set) as string[];
  }, [doctors]);

  const filtered = (doctors ?? []).filter((d: any) => {
    const name = d.profile?.full_name || "";

    const matchesQ =
      !q ||
      name.toLowerCase().includes(q.toLowerCase()) ||
      d.specialty?.toLowerCase().includes(q.toLowerCase());

    const matchesSpec = spec === "all" || d.specialty === spec;
    const matchesCity = city === "all" || d.city === city;

    const matchesOnline =
      online === "all" ||
      (online === "online" ? d.is_online : !d.is_online);

    return matchesQ && matchesSpec && matchesCity && matchesOnline;
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Loading doctors...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-destructive">
        Could not load doctors. Check Supabase tables and policies.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
        <p className="text-muted-foreground">
          Browse verified doctors, compare profiles, ratings, languages, and
          availability.
        </p>
      </div>

      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by doctor name or specialty..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={spec} onValueChange={setSpec}>
            <SelectTrigger>
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All specialties</SelectItem>
              {SPECIALTIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={online} onValueChange={setOnline}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Online or offline</SelectItem>
              <SelectItem value="online">Online now</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cities</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Stethoscope className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">
            No doctors match your search.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d: any) => {
            const doctorProfileId = String(d.id || d.user_id);
            const bannerUrl = d.banner_url || d.banner_image_url;
            const doctorName = d.profile?.full_name || "Doctor";

            return (
              <Card
                key={doctorProfileId}
                className="overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="h-20 bg-gradient-to-r from-primary to-accent">
                  {bannerUrl && (
                    <img
                      src={bannerUrl}
                      alt="Doctor banner"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <CardContent className="p-5 pt-0">
                  <div className="-mt-8 flex items-start justify-between gap-3">
                    <div className="flex items-end gap-3">
                      <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border-4 border-background gradient-medical text-lg font-bold text-primary-foreground">
                        {d.profile_photo_url ? (
                          <img
                            src={d.profile_photo_url}
                            alt="Doctor"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          doctorName.charAt(0)
                        )}
                      </div>

                      <div className="pb-1">
                        <div className="font-semibold">Dr. {doctorName}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.specialty}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`mt-8 rounded-full px-2 py-0.5 text-xs font-medium ${
                        d.is_online
                          ? "bg-success/15 text-success"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {d.is_online ? "Online" : "Offline"}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Info
                      label="Experience"
                      value={`${d.years_experience || 0} yrs`}
                    />

                    <Info
                      label="Fee"
                      value={fmtAFN(d.consultation_fee || 0)}
                    />

                    <Info
                      icon={Star}
                      label="Rating"
                      value={
                        d.average_rating
                          ? `${d.average_rating.toFixed(1)} (${d.review_count})`
                          : "New"
                      }
                    />

                    <Info
                      icon={Languages}
                      label="Languages"
                      value={
                        Array.isArray(d.languages)
                          ? d.languages.join(", ")
                          : d.languages || "Dari"
                      }
                    />
                  </div>

                  {d.city && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {d.city}
                    </div>
                  )}

                  <Button
                    type="button"
                    className="mt-4 w-full"
                    onClick={() => {
                      window.location.href = `/patient/doctors/${doctorProfileId}`;
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Info({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: any;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      <div className="line-clamp-1 font-medium">{value}</div>
    </div>
  );
}
