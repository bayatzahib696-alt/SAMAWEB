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

export function AuthCard({
  role,
  title,
  subtitle,
  allowSignup = true,
}: AuthCardProps) {
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // Signup state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");

  // Doctor signup fields
  const [specialty, setSpecialty] = useState<string>(SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  const dashboardFor = (r: AppRole) => `/${r}`;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPwd) {
      return toast.error("Please enter your email and password.");
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password: loginPwd,
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const userId = data.user?.id;

      if (!userId) {
        toast.error("Login failed. Please try again.");
        setLoading(false);
        return;
      }

      const { data: roleRow, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .maybeSingle();

      if (roleError) {
        console.error("Role check error:", roleError);
        await supabase.auth.signOut();
        toast.error("Could not check your account role. Please try again.");
        setLoading(false);
        return;
      }

      if (!roleRow || roleRow.role !== role) {
        await supabase.auth.signOut();
        toast.error(`This account is not a ${role} account.`);
        setLoading(false);
        return;
      }

      toast.success("Welcome back!");

      // Use full page redirect online to avoid route freeze after login
      window.location.href = dashboardFor(role);
    } catch (err) {
      console.error("Login crash:", err);
      toast.error("Something went wrong during login.");
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();

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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
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
      });

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      const uid = data.user?.id;

      if (!uid) {
        toast.error("Sign up failed.");
        setLoading(false);
        return;
      }

      if (role === "doctor") {
        toast.success(
          "Doctor account created! Your account may need admin approval."
        );
      } else {
        toast.success("Account created!");
      }

      // Use full page redirect online to avoid route freeze after signup
      window.location.href = dashboardFor(role);
    } catch (err) {
      console.error("Signup crash:", err);
      toast.error("Something went wrong during signup.");
      setLoading(false);
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
                          <Field label="Years of experience">
                            <Input
                              type="number"
                              min="0"
                              value={yearsExperience}
                              onChange={(e) =>
                                setYearsExperience(e.target.value)
                              }
                            />
                          </Field>

                          <Field label="Consultation fee">
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