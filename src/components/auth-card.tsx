import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { SPECIALTIES } from "@/lib/constants";
import type { AppRole } from "@/hooks/use-auth";
import { Stethoscope, ArrowLeft } from "lucide-react";

interface AuthCardProps {
  role: AppRole;
  title: string;
  subtitle: string;
  allowSignup?: boolean;
}

export function AuthCard({ role, title, subtitle, allowSignup = true }: AuthCardProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // signup base
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");

  // doctor extras
  const [specialty, setSpecialty] = useState<string>(SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  const dashboardFor = (r: AppRole) => `/${r}`;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPwd });
    setLoading(false);
    if (error) return toast.error(error.message);
    // Check role
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id).maybeSingle();
    if (!r || r.role !== role) {
      await supabase.auth.signOut();
      return toast.error(`This account is not a ${role} account.`);
    }
    toast.success("Welcome back!");
    navigate({ to: dashboardFor(role) });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== cpwd) return toast.error("Passwords do not match.");
    if (pwd.length < 6) return toast.error("Password must be at least 6 characters.");
    if (role === "doctor" && (!licenseNumber || !consultationFee)) return toast.error("Please fill in all doctor details.");

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pwd,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
          role,
          ...(role === "doctor"
            ? {
                specialty,
                license_number: licenseNumber,
                years_experience: yearsExperience || "0",
                consultation_fee: consultationFee || "0",
              }
            : {}),
        },
      },
    });
    if (error) {
      setLoading(false);
      return toast.error(error.message);
    }
    const uid = data.user?.id;
    if (!uid) {
      setLoading(false);
      return toast.error("Sign up failed.");
    }

    // The Supabase trigger in supabase/manual/setup-auth-working.sql creates:
    // profiles, user_roles, patients, and doctors automatically from signup metadata.

    setLoading(false);
    if (role === "doctor") {
      toast.success("Account created! Your account is pending admin approval.");
    } else {
      toast.success("Account created!");
    }
    navigate({ to: dashboardFor(role) });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-10">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg gradient-medical">
            <Stethoscope className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">SAMA</span>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{subtitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className={allowSignup ? "grid w-full grid-cols-2" : "grid w-full grid-cols-1"}>
                <TabsTrigger value="login">Login</TabsTrigger>
                {allowSignup && <TabsTrigger value="signup">Sign up</TabsTrigger>}
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <Field label="Email">
                    <Input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  </Field>
                  <Field label="Password">
                    <Input type="password" required value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} />
                  </Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              {allowSignup && (
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4 pt-4">
                    <Field label="Full name">
                      <Input required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </Field>
                    <Field label="Phone number">
                      <Input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+93 ..." />
                    </Field>
                    <Field label={role === "patient" ? "Email (optional but recommended for login)" : "Email"}>
                      <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Field>

                    {role === "doctor" && (
                      <>
                        <Field label="Specialty">
                          <Select value={specialty} onValueChange={setSpecialty}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {SPECIALTIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </Field>
                        <Field label="Medical license number">
                          <Input required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} />
                        </Field>
                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Years of experience">
                            <Input type="number" min="0" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
                          </Field>
                          <Field label="Consultation fee (AFN)">
                            <Input type="number" min="0" required value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} />
                          </Field>
                        </div>
                      </>
                    )}

                    <Field label="Password">
                      <Input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} />
                    </Field>
                    <Field label="Confirm password">
                      <Input type="password" required value={cpwd} onChange={(e) => setCpwd(e.target.value)} />
                    </Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}

