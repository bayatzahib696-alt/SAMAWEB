import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Stethoscope, Video, FileText, Calendar, ShieldCheck, UserCog } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAMA — Connect with doctors online" },
      { name: "description", content: "Book online doctor consultations across Afghanistan. Video visits, digital prescriptions, and trusted care in AFN." },
      { property: "og:title", content: "SAMA" },
      { property: "og:description", content: "Online doctor consultations for Afghanistan." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/60 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg gradient-medical">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">SAMA</span>
          </Link>
          <div className="hidden gap-2 sm:flex">
            <Button asChild variant="ghost"><Link to="/auth/admin">Admin</Link></Button>
            <Button asChild variant="outline"><Link to="/auth/doctor">Doctor</Link></Button>
            <Button asChild><Link to="/auth/patient">Patient login</Link></Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, var(--color-primary-glow), transparent 50%), radial-gradient(circle at 80% 60%, var(--color-accent), transparent 55%)" }} />
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-success" /> Trusted by clinics across Afghanistan
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                See a doctor <span className="text-gradient-medical">from anywhere</span> in Afghanistan
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                Book appointments with verified doctors, meet over video consultations, and get digital
                prescriptions — all in one secure place. Pricing in AFN.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg"><Link to="/auth/patient">I'm a Patient</Link></Button>
                <Button asChild size="lg" variant="outline"><Link to="/auth/doctor">I'm a Doctor</Link></Button>
                <Button asChild size="lg" variant="ghost"><Link to="/auth/admin">Admin login</Link></Button>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                <Stat n="500+" l="Doctors" />
                <Stat n="10k+" l="Patients" />
                <Stat n="24/7" l="Support" />
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border bg-card p-6 shadow-xl">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full gradient-medical" />
                    <div>
                      <div className="text-sm font-semibold">Dr. Ahmad Karimi</div>
                      <div className="text-xs text-muted-foreground">Cardiologist • 12 yrs</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-medium text-success">Online</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Slot t="09:00" />
                  <Slot t="10:30" />
                  <Slot t="14:00" />
                  <Slot t="16:30" />
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary p-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Consultation fee</div>
                    <div className="text-lg font-bold">800 AFN</div>
                  </div>
                  <Button size="sm">Book now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need for online care</h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">From booking to prescription — fast, simple, and secure.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Feature icon={Calendar} title="Book consultations" desc="Choose your doctor, pick a time slot, and book online in seconds." />
            <Feature icon={Video} title="Video consultation" desc="Meet your doctor face-to-face from your phone or laptop." />
            <Feature icon={FileText} title="Digital prescriptions" desc="Receive prescriptions and visit summaries you can save and share." />
            <Feature icon={ShieldCheck} title="Verified doctors" desc="Every doctor is reviewed and approved by our admin team." />
            <Feature icon={Stethoscope} title="Multiple specialties" desc="Find the right specialist — from cardiology to dermatology." />
            <Feature icon={UserCog} title="Manage your care" desc="Keep all your appointments and prescriptions in one place." />
          </div>
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4" /> SAMA © {new Date().getFullYear()}
          </div>
          <div className="text-xs text-muted-foreground">Built for the Afghanistan market. Currency: AFN.</div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="text-2xl font-bold">{n}</div>
      <div className="text-xs text-muted-foreground">{l}</div>
    </div>
  );
}
function Slot({ t }: { t: string }) {
  return <div className="rounded-lg border bg-background p-2 text-center font-medium">{t}</div>;
}
function Feature({ icon: Icon, title, desc }: { icon: typeof Calendar; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="grid h-11 w-11 place-items-center rounded-xl gradient-medical">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}

