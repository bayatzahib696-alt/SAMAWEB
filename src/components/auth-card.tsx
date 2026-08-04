import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/hooks/use-auth";
import { SPECIALTIES } from "@/lib/constants";
import { LanguageSwitcher, SamaLogo, useLanguage } from "@/lib/language";

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

async function withTimeout<T>(promise: Promise<T>, ms = 15000): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Request timed out. Please try again.")), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

export function AuthCard({ role, title, subtitle, allowSignup = true }: AuthCardProps) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");

  const [specialty, setSpecialty] = useState<string>(SPECIALTIES[0] || "General Physician");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail || !loginPwd) {
      setMessage(t("enterEmailPassword"));
      return;
    }

    setLoading(true);
    setMessage(t("signingIn"));

    try {
      const { error } = await withTimeout(
        supabase.auth.signInWithPassword({ email: cleanEmail, password: loginPwd })
      );

      if (error) {
        setLoading(false);
        setMessage(error.message);
        return;
      }

      window.localStorage.setItem(ROLE_KEY, role);
      setTimeout(() => {
        window.location.href = dashboardFor(role);
      }, 250);
    } catch (err: any) {
      console.error("Login error:", err);
      setLoading(false);
      setMessage(err?.message || "Login failed.");
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!fullName.trim()) return setMessage(t("fullName"));
    if (!email.trim()) return setMessage(t("email"));
    if (pwd !== cpwd) return setMessage(t("passwordsNotMatch"));
    if (pwd.length < 6) return setMessage(t("passwordLength"));
    if (role === "doctor" && (!licenseNumber.trim() || !consultationFee)) {
      return setMessage("Please fill in all doctor details.");
    }

    setLoading(true);
    setMessage(t("creatingAccount"));

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
        setMessage(error.message);
        return;
      }

      window.localStorage.setItem(ROLE_KEY, role);
      setTimeout(() => {
        window.location.href = dashboardFor(role);
      }, 350);
    } catch (err: any) {
      console.error("Signup error:", err);
      setLoading(false);
      setMessage(err?.message || "Signup failed.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "34px 16px" }}>
      <div style={{ maxWidth: 440, margin: "0 auto" }}>
        <div style={topBarStyle}>
          <a href="/" style={backStyle}>← {t("goHome")}</a>
          <LanguageSwitcher />
        </div>

        <div style={{ marginBottom: 20 }}><SamaLogo /></div>

        <div style={cardStyle}>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>{title}</h2>
          <p style={{ color: "#64748b", marginTop: 8, marginBottom: 20 }}>{subtitle}</p>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => { setMode("login"); setMessage(""); }}
              style={{ ...tabStyle, background: mode === "login" ? "#0f766e" : "white", color: mode === "login" ? "white" : "#0f172a" }}
            >
              {t("login")}
            </button>
            {allowSignup && (
              <button
                type="button"
                onClick={() => { setMode("signup"); setMessage(""); }}
                style={{ ...tabStyle, background: mode === "signup" ? "#0f766e" : "white", color: mode === "signup" ? "white" : "#0f172a" }}
              >
                {t("signup")}
              </button>
            )}
          </div>

          {message && <div style={messageStyle}>{message}</div>}

          {mode === "login" && (
            <form onSubmit={handleLogin}>
              <Field label={t("email")}><input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} style={inputStyle} /></Field>
              <Field label={t("password")}><input type="password" required value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} style={inputStyle} /></Field>
              <button type="submit" disabled={loading} style={submitStyle}>{loading ? t("signingIn") : t("signIn")}</button>
            </form>
          )}

          {mode === "signup" && allowSignup && (
            <form onSubmit={handleSignup}>
              <Field label={t("fullName")}><input required value={fullName} onChange={(e) => setFullName(e.target.value)} style={inputStyle} /></Field>
              <Field label={t("phoneNumber")}><input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+93 ..." style={inputStyle} /></Field>
              <Field label={t("email")}><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></Field>
              {role === "doctor" && (
                <>
                  <Field label={t("specialty")}><select value={specialty} onChange={(e) => setSpecialty(e.target.value)} style={inputStyle}>{SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}</select></Field>
                  <Field label={t("licenseNumber")}><input required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} style={inputStyle} /></Field>
                  <Field label={t("yearsExperience")}><input type="number" min="0" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} style={inputStyle} /></Field>
                  <Field label={t("consultationFee")}><input type="number" min="0" required value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} style={inputStyle} /></Field>
                </>
              )}
              <Field label={t("password")}><input type="password" required value={pwd} onChange={(e) => setPwd(e.target.value)} style={inputStyle} /></Field>
              <Field label={t("confirmPassword")}><input type="password" required value={cpwd} onChange={(e) => setCpwd(e.target.value)} style={inputStyle} /></Field>
              <button type="submit" disabled={loading} style={submitStyle}>{loading ? t("creatingAccount") : t("createAccount")}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 700, color: "#334155" }}>{label}</span>
      {children}
    </label>
  );
}

const topBarStyle: React.CSSProperties = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 };
const backStyle: React.CSSProperties = { color: "#475569", textDecoration: "none", fontSize: 14, fontWeight: 700 };
const cardStyle: React.CSSProperties = { background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: 24, boxShadow: "0 20px 55px rgba(15, 23, 42, 0.08)" };
const tabStyle: React.CSSProperties = { flex: 1, padding: "10px 12px", borderRadius: 12, border: "1px solid #cbd5e1", cursor: "pointer", fontWeight: 800 };
const messageStyle: React.CSSProperties = { padding: 12, borderRadius: 12, background: "#fef3c7", color: "#92400e", marginBottom: 16, fontSize: 14 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 12px", borderRadius: 12, border: "1px solid #cbd5e1", fontSize: 15, outline: "none", boxSizing: "border-box" };
const submitStyle: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "none", background: "#0f766e", color: "white", fontSize: 15, fontWeight: 800, cursor: "pointer", marginTop: 6 };
