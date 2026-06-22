import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, Stethoscope } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/video/$id")({
  component: VideoCall,
});

function VideoCall() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [cam, setCam] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/" });
  }, [loading, user, navigate]);

  const { data } = useQuery({
    queryKey: ["video", id],
    enabled: !!user,
    queryFn: async () => {
      const { data: a } = await supabase.from("appointments").select("*").eq("id", id).maybeSingle();
      if (!a) return null;
      const { data: profs } = await supabase.from("profiles").select("id, full_name").in("id", [a.patient_id, a.doctor_id]);
      const m = new Map((profs ?? []).map((p) => [p.id, p]));
      return { ...a, patient: m.get(a.patient_id), doctor: m.get(a.doctor_id) };
    },
  });

  if (!data) return <div className="grid min-h-screen place-items-center text-muted-foreground">Loading…</div>;

  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.15_0.03_240)] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          <span className="font-bold">SAMA — Video Consultation</span>
        </div>
        <div className="text-sm opacity-70">{data.appointment_date} {data.appointment_time?.toString().slice(0, 5)}</div>
      </header>

      <div className="grid flex-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-6">
        <VideoTile name={`Dr. ${data.doctor?.full_name || "—"}`} role="Doctor" />
        <VideoTile name={data.patient?.full_name || "Patient"} role="Patient" muted={muted} camOn={cam} you />
      </div>

      <div className="flex justify-center gap-3 border-t border-white/10 p-4">
        <Button size="lg" variant={muted ? "destructive" : "secondary"} onClick={() => setMuted((m) => !m)}>
          {muted ? <MicOff /> : <Mic />}
        </Button>
        <Button size="lg" variant={!cam ? "destructive" : "secondary"} onClick={() => setCam((c) => !c)}>
          {cam ? <VideoIcon /> : <VideoOff />}
        </Button>
        <Button size="lg" variant="destructive" onClick={() => { toast.info("Call ended"); navigate({ to: "/" }); }}>
          <PhoneOff className="mr-2" /> End Call
        </Button>
      </div>

      <div className="border-t border-white/10 bg-black/30 px-4 py-2 text-center text-xs opacity-70">
        Prototype placeholder — real video integration coming soon.
        <Link to="/" className="ml-3 underline">Exit</Link>
      </div>
    </div>
  );
}

function VideoTile({ name, role, muted, camOn = true, you }: { name: string; role: string; muted?: boolean; camOn?: boolean; you?: boolean }) {
  return (
    <div className="relative grid min-h-[260px] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[oklch(0.25_0.05_240)] to-[oklch(0.18_0.04_245)]">
      {camOn ? (
        <div className="grid h-24 w-24 place-items-center rounded-full bg-white/10 text-3xl font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      ) : (
        <div className="text-sm opacity-60">Camera off</div>
      )}
      <div className="absolute bottom-3 left-3 rounded-md bg-black/50 px-2 py-1 text-xs backdrop-blur">
        {name} {you && "(You)"} · {role} {muted && "· muted"}
      </div>
    </div>
  );
}

