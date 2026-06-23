import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

const ROLE_KEY = "sama_role";

function dashboardFor(role: AppRole) {
  return `/${role}`;
}

async function withTimeout<T>(
  promise: Promise<T>,
  ms = 15000
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Request timed out. Please try again."));
    }, ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

export function AuthCard({
  role,
  title,
  subtitle,
  allowSignup = true,
}: AuthCardProps) {
  const [loading, setLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");

  const [specialty, setSpecialty] = useState<string>(SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail || !loginPwd) {
      return toast.error("Please enter your email and password.");
    }

    setLoading(true);

    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: loginPwd,
        })
      );

      if (error) {
        setLoading(false);
        return toast.error(error.message);
      }

      window.localStorage.setItem(ROLE_KEY, role);
      window.location.href = dashboardFor(role);
    } catch (err: any) {
      console.error("Login error:", err);
      setLoading(false);
      toast.error(err?.message || "Login failed.");
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

    if (loading) return;

    if (!fullName.trim()) return toast.error("Please enter your full name.");
    if (!email.trim()) return toast.error("Please enter your email.");
    if (pwd !== cpwd) return toast.error("Passwords do not match.");
    if (pwd.length < 6)
      return toast.error("Password must be at least 6 characters.");

    if (role === "doctor" && (!licenseNumber.trim() || !consultationFee)) {
      return toast.error("Please fill in all doctor details.");
    }

    setLoading(true);

    try {
      const { error } = await withTimeout(
        supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password: pwd,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              role,
              ...(role === "doctor"
                ? {
                    specialty,
                    license_number: licenseNumber.trim(),
                    years_experience: yearsExperience || "0",
                    consultation_fee: consultationFee || "0",
                  }
                : {}),
            },
          },
        })
      );

      if (error) {
        setLoading(false);
        return toast.error(error.message);
      }

      window.localStorage.setItem(ROLE_KEY, role);
      window.location.href = dashboardFor(role);
    } catch (err: any) {
      console.error("Signup error:", err);
      setLoading(false);
      toast.error(err?.message || "Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
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
              <TabsList
                className={
                  allowSignup
                    ? "grid w-full grid-cols-2"
                    : "grid w-full grid-cols-1"
                }
              >
                <TabsTrigger value="login">Login</TabsTrigger>
                {allowSignup && (
                  <TabsTrigger value="signup">Sign up</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 pt-4">
                  <Field label="Email">
                    <Input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </Field>

                  <Field label="Password">
                    <Input
                      type="password"
                      required
                      value={loginPwd}
                      onChange={(e) => setLoginPwd(e.target.value)}
                    />
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
                      <Input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </Field>

                    <Field label="Phone number">
                      <Input
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+93 ..."
                      />
                    </Field>

                    <Field label="Email">
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </Field>

                    {role === "doctor" && (
                      <>
                        <Field label="Specialty">
                          <Select value={specialty} onValueChange={setSpecialty}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SPECIALTIES.map((s) => (
                                <SelectItem key={s} value={s}>
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>

                        <Field label="Medical license number">
                          <Input
                            required
                            value={licenseNumber}
                            onChange={(e) =>
                              setLicenseNumber(e.target.value)
                            }
                          />
                        </Field>

                        <div className="grid grid-cols-2 gap-3">
                          <Field label="Years">
                            <Input
                              type="number"
                              min="0"
                              value={yearsExperience}
                              onChange={(e) =>
                                setYearsExperience(e.target.value)
                              }
                            />
                          </Field>

                          <Field label="Fee">
                            <Input
                              type="number"
                              min="0"
                              required
                              value={consultationFee}
                              onChange={(e) =>
                                setConsultationFee(e.target.value)
                              }
                            />
                          </Field>
                        </div>
                      </>
                    )}

                    <Field label="Password">
                      <Input
                        type="password"
                        required
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                      />
                    </Field>

                    <Field label="Confirm password">
                      <Input
                        type="password"
                        required
                        value={cpwd}
                        onChange={(e) => setCpwd(e.target.value)}
                      />
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
    </div>
  );
}