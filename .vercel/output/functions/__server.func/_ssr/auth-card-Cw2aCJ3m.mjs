import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { c as cn } from "./utils-H80jjgLf.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as SPECIALTIES } from "./constants-BMfp__yZ.mjs";
import { A as ArrowLeft, S as Stethoscope } from "../_libs/lucide-react.mjs";
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function AuthCard({ role, title, subtitle, allowSignup = true }) {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  const [loginEmail, setLoginEmail] = reactExports.useState("");
  const [loginPwd, setLoginPwd] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [pwd, setPwd] = reactExports.useState("");
  const [cpwd, setCpwd] = reactExports.useState("");
  const [specialty, setSpecialty] = reactExports.useState(SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = reactExports.useState("");
  const [yearsExperience, setYearsExperience] = reactExports.useState("");
  const [consultationFee, setConsultationFee] = reactExports.useState("");
  const dashboardFor = (r) => `/${r}`;
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPwd });
    setLoading(false);
    if (error) return toast.error(error.message);
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
    if (!r || r.role !== role) {
      await supabase.auth.signOut();
      return toast.error(`This account is not a ${role} account.`);
    }
    toast.success("Welcome back!");
    navigate({ to: dashboardFor(role) });
  };
  const handleSignup = async (e) => {
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
          ...role === "doctor" ? {
            specialty,
            license_number: licenseNumber,
            years_experience: yearsExperience || "0",
            consultation_fee: consultationFee || "0"
          } : {}
        }
      }
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
    setLoading(false);
    if (role === "doctor") {
      toast.success("Account created! Your account is pending admin approval.");
    } else {
      toast.success("Account created!");
    }
    navigate({ to: dashboardFor(role) });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-md px-4 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
      " Back home"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg gradient-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "h-5 w-5 text-primary-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold tracking-tight", children: "SAMA" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: subtitle })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "login", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: allowSignup ? "grid w-full grid-cols-2" : "grid w-full grid-cols-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", children: "Login" }),
          allowSignup && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Sign up" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "login", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, value: loginEmail, onChange: (e) => setLoginEmail(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, value: loginPwd, onChange: (e) => setLoginPwd(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Signing in..." : "Sign in" })
        ] }) }),
        allowSignup && /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignup, className: "space-y-4 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: fullName, onChange: (e) => setFullName(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+93 ..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: role === "patient" ? "Email (optional but recommended for login)" : "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value) }) }),
          role === "doctor" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Specialty", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: specialty, onValueChange: setSpecialty, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SPECIALTIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Medical license number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { required: true, value: licenseNumber, onChange: (e) => setLicenseNumber(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Years of experience", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", value: yearsExperience, onChange: (e) => setYearsExperience(e.target.value) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Consultation fee (AFN)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", min: "0", required: true, value: consultationFee, onChange: (e) => setConsultationFee(e.target.value) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, value: pwd, onChange: (e) => setPwd(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Confirm password", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, value: cpwd, onChange: (e) => setCpwd(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", className: "w-full", disabled: loading, children: loading ? "Creating account..." : "Create account" })
        ] }) })
      ] }) })
    ] })
  ] }) });
}
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm", children: label }),
    children
  ] });
}
export {
  AuthCard as A
};
