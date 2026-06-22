import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-eY6oqIRW.mjs";
import { u as useAuth } from "./use-auth-op3kQd7h.mjs";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DCDRzI6q.mjs";
import { I as Input } from "./input-C0QjszdI.mjs";
import { L as Label } from "./label-JU3yqRBo.mjs";
import { B as Button } from "./button-BC9oXVxV.mjs";
import { T as Textarea } from "./textarea-DSyJ1nlY.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CZRUt5a6.mjs";
import { S as SPECIALTIES } from "./constants-BMfp__yZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as UserRound, I as Image, S as Stethoscope } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./utils-H80jjgLf.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
const db = supabase;
function DoctorProfileEditor() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [fullName, setFullName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [specialty, setSpecialty] = reactExports.useState(SPECIALTIES[0]);
  const [licenseNumber, setLicenseNumber] = reactExports.useState("");
  const [yearsExperience, setYearsExperience] = reactExports.useState("");
  const [consultationFee, setConsultationFee] = reactExports.useState("");
  const [bio, setBio] = reactExports.useState("");
  const [bannerUrl, setBannerUrl] = reactExports.useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = reactExports.useState("");
  const [education, setEducation] = reactExports.useState("");
  const [languages, setLanguages] = reactExports.useState("Dari, Pashto");
  const [clinicName, setClinicName] = reactExports.useState("");
  const [city, setCity] = reactExports.useState("");
  const [availability, setAvailability] = reactExports.useState("09:00, 10:30, 12:00, 14:00");
  const [isOnline, setIsOnline] = reactExports.useState(false);
  const [saving, setSaving] = reactExports.useState(false);
  const {
    data
  } = useQuery({
    queryKey: ["doctor-profile-editor", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const {
        data: prof
      } = await db.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const {
        data: doc
      } = await db.from("doctors").select("*").eq("user_id", user.id).maybeSingle();
      return {
        prof,
        doc
      };
    }
  });
  reactExports.useEffect(() => {
    if (data?.prof) {
      setFullName(data.prof.full_name || "");
      setPhone(data.prof.phone || "");
    }
    if (data?.doc) {
      setSpecialty(data.doc.specialty || SPECIALTIES[0]);
      setLicenseNumber(data.doc.license_number || "");
      setYearsExperience(String(data.doc.years_experience ?? ""));
      setConsultationFee(String(data.doc.consultation_fee ?? ""));
      setBio(data.doc.bio || "");
      setBannerUrl(data.doc.banner_url || "");
      setProfilePhotoUrl(data.doc.profile_photo_url || "");
      setEducation(data.doc.education || "");
      setLanguages(Array.isArray(data.doc.languages) ? data.doc.languages.join(", ") : data.doc.languages || "");
      setClinicName(data.doc.clinic_name || "");
      setCity(data.doc.city || "");
      setAvailability(data.doc.availability || "09:00, 10:30, 12:00, 14:00");
      setIsOnline(Boolean(data.doc.is_online));
    }
  }, [data]);
  const save = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const {
      error: profileError
    } = await db.from("profiles").update({
      full_name: fullName,
      phone
    }).eq("id", user.id);
    if (profileError) {
      setSaving(false);
      return toast.error(profileError.message);
    }
    const languageArray = languages.split(",").map((l) => l.trim()).filter(Boolean);
    const {
      error
    } = await db.from("doctors").upsert({
      user_id: user.id,
      specialty,
      license_number: licenseNumber,
      years_experience: Number(yearsExperience) || 0,
      consultation_fee: Number(consultationFee) || 0,
      bio: bio || null,
      banner_url: bannerUrl || null,
      profile_photo_url: profilePhotoUrl || null,
      education: education || null,
      languages: languageArray.length ? languageArray : ["Dari"],
      clinic_name: clinicName || null,
      city: city || null,
      availability: availability || null,
      is_online: isOnline
    }, {
      onConflict: "user_id"
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Doctor profile updated");
    qc.invalidateQueries({
      queryKey: ["doctor-profile-editor"]
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: "Doctor Profile Builder" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Create the professional banner/profile patients will see before booking." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: save, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { className: "mt-1 h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Basic Information" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Your public doctor identity." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Phone", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: phone, onChange: (e) => setPhone(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Specialty", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: specialty, onValueChange: setSpecialty, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SPECIALTIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "License number", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: licenseNumber, onChange: (e) => setLicenseNumber(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Years of experience", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: yearsExperience, onChange: (e) => setYearsExperience(e.target.value) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Consultation fee (AFN)", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", value: consultationFee, onChange: (e) => setConsultationFee(e.target.value) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Bio", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 4, value: bio, onChange: (e) => setBio(e.target.value), placeholder: "Short professional biography" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "mt-1 h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Banner and Profile Design" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Add image URLs now. Later you can connect Supabase Storage for uploads." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Banner image URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: bannerUrl, onChange: (e) => setBannerUrl(e.target.value), placeholder: "https://..." }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Profile photo URL", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: profilePhotoUrl, onChange: (e) => setProfilePhotoUrl(e.target.value), placeholder: "https://..." }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-xl border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-gradient-to-r from-primary to-accent", children: bannerUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: bannerUrl, className: "h-full w-full object-cover" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-3 p-4 pt-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "-mt-10 grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border-4 border-background gradient-medical text-2xl font-bold text-primary-foreground", children: profilePhotoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: profilePhotoUrl, className: "h-full w-full object-cover" }) : (fullName || "D").charAt(0) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold", children: [
                  "Dr. ",
                  fullName || "Your Name"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: specialty })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Stethoscope, { className: "mt-1 h-5 w-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Practice Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Help patients choose the right doctor." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Education", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: education, onChange: (e) => setEducation(e.target.value), placeholder: "MD, Kabul Medical University..." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Languages", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: languages, onChange: (e) => setLanguages(e.target.value), placeholder: "Dari, Pashto, English" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Clinic / Hospital name", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: clinicName, onChange: (e) => setClinicName(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "City / Province", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: city, onChange: (e) => setCity(e.target.value) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Availability slots", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: availability, onChange: (e) => setAvailability(e.target.value), placeholder: "09:00, 10:30, 14:00" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Online status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: isOnline ? "online" : "offline", onValueChange: (v) => setIsOnline(v === "online"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "online", children: "Online" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "offline", children: "Offline" })
            ] })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: saving, children: saving ? "Saving..." : "Save doctor profile" })
    ] })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: label }),
    children
  ] });
}
export {
  DoctorProfileEditor as component
};
