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
const USER_KEY = "sama_user_id";

async function withTimeout<T>(
  promise: Promise<T>,
  ms = 15000,
  message = "Request timed out"
): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

function saveRole(role: AppRole, userId: string) {
  window.localStorage.setItem(ROLE_KEY, role);
  window.localStorage.setItem(USER_KEY, userId);
}

function clearRole() {
  window.localStorage.removeItem(ROLE_KEY);
  window.localStorage.removeItem(USER_KEY);
}

function dashboardFor(role: AppRole) {
  return `/${role}`;
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
      return toast.error("Please enter email and password.");
    }

    setLoading(true);
    clearRole();

    try {
      await withTimeout(
        supabase.auth.signOut(),
        10000,
        "Previous session cleanup timed out"
      );

      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: loginPwd,
        }),
        15000,
        "Login timed out. Check internet or Supabase settings."
      );

      if (error) {
        setLoading(false);
        return toast.error(error.message);
      }

      const userId = data.user?.id;

      if (!userId) {
        setLoading(false);
        return toast.error("Login failed. User ID missing.");
      }

      const { data: roleRow, error: roleError } = await withTimeout(
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .maybeSingle(),
        15000,
        "Role check timed out."
      );

      if (roleError) {
        console.error("Role check error:", roleError);
        await supabase.auth.signOut();
        clearRole();
        setLoading(false);
        return toast.error("Could not check account role.");
      }

      if (!roleRow || roleRow.role !== role) {
        await supabase.auth.signOut();
        clearRole();
        setLoading(false);
        return toast.error(`This account is not a ${role} account.`);
      }

      saveRole(role, userId);

      toast.success("Login successful.");

      setTimeout(() => {
        window.location.replace(dashboardFor(role));
      }, 300);
    } catch (err: any) {
      console.error("Login crash:", err);
      clearRole();
      await supabase.auth.signOut();
      setLoading(false);
      toast.error(err?.message || "Login failed. Please try again.");
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
    clearRole();

    try {
      const { data, error } = await withTimeout(
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
        }),
        15000,
        "Signup timed out."
      );

      if (error) {
        setLoading(false);
        return toast.error(error.message);
      }

      const userId = data.user?.id;

      if (!userId) {
        setLoading(false);
        return toast.error("Signup failed. User ID missing.");
      }

      saveRole(role, userId);

      toast.success("Account created.");

      setTimeout(() => {
        window.location.replace(dashboardFor(role));
      }, 500);
    } catch (err: any) {
      console.error("Signup crash:", err);
      clearRole();
      setLoading(false);
      toast.error(err?.message || "Signup failed. Please try again.");
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