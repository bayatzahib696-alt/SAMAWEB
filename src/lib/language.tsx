import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "fa" | "ps";
const LANGUAGE_KEY = "sama_language";

const dictionary = {
  en: {
    language: "Language",
    english: "English",
    dari: "Dari",
    pashto: "Pashto",
    signIn: "Sign in",
    signOut: "Sign out",
    goHome: "Go home",
    loading: "Loading account...",
    pleaseLogin: "Please login first",
    noSession: "Your login session was not found.",
    wrongAccount: "Wrong account type",
    wrongAccountText: "This page is for a different account type.",
    dashboard: "Dashboard",
    appointments: "Appointments",
    doctors: "Doctors",
    patients: "Patients",
    profile: "Profile",
    reviews: "Reviews",
    posts: "Posts",
    careCoordination: "Care Coordination",
    payments: "Payments",
    users: "Users",
    email: "Email",
    password: "Password",
    fullName: "Full name",
    phoneNumber: "Phone number",
    confirmPassword: "Confirm password",
    createAccount: "Create account",
    login: "Login",
    signup: "Sign up",
    signingIn: "Signing in...",
    creatingAccount: "Creating account...",
    enterEmailPassword: "Please enter your email and password.",
    passwordsNotMatch: "Passwords do not match.",
    passwordLength: "Password must be at least 6 characters.",
    specialty: "Specialty",
    licenseNumber: "Medical license number",
    yearsExperience: "Years of experience",
    consultationFee: "Consultation fee",
    homePlatform: "Afghanistan Telehealth Platform",
    navFeatures: "Features",
    navDoctors: "Doctors",
    navHow: "How it works",
    homeBadge: "Trusted digital healthcare access",
    homeTitle: "Find doctors, book appointments, and manage care with SAMA.",
    homeSubtitle:
      "SAMA connects patients, doctors, and admins in one secure healthcare platform. Patients can search doctors, book visits, track medications, send lab requests, and manage health information from one place.",
    searchPlaceholder: "Search doctor, specialty, or city",
    search: "Search",
    access: "Access",
    userPortals: "User portals",
    healthRecords: "Health records",
    samaCare: "SAMA Care",
    online: "Online",
    verifiedDoctors: "Book with verified doctors",
    chooseDoctor: "Choose by specialty, city, fee, and experience.",
    nextAppointment: "Next appointment",
    generalConsultation: "General consultation",
    todayTime: "Today · 4:30 PM",
    confirm: "Confirm",
    medication: "Medication",
    labRequest: "Lab request",
    allergies: "Allergies",
    platformFeatures: "Platform features",
    everythingModernCare: "Everything needed for modern care",
    builtFor: "Built for patient booking, doctor management, and admin control.",
    doctorSearch: "Doctor search",
    doctorSearchText: "Search by specialty, city, gender, fee, experience, and availability.",
    appointmentBooking: "Appointment booking",
    appointmentBookingText: "Patients can request appointments and doctors can accept or reject.",
    careCoordinationText: "Admin and care team can manage patient requests and follow-up tasks.",
    patientHealthProfile: "Patient health profile",
    patientHealthProfileText: "Store allergies, medication notes, treatment plans, and visit history.",
    doctorReviews: "Doctor reviews",
    doctorReviewsText: "Patients can rate doctors and help others choose the right provider.",
    labCommunication: "Lab communication",
    labCommunicationText: "Create lab requests and track test status from patient to provider.",
    findCare: "Find care",
    popularSpecialties: "Popular specialties",
    bookAppointment: "Book appointment",
    simpleProcess: "Simple process",
    howSamaWorks: "How SAMA works",
    createAccountStep: "Create account",
    createAccountStepText: "Patient, doctor, or admin logs into the correct portal.",
    searchRequestStep: "Search and request",
    searchRequestStepText: "Patient finds a doctor and submits appointment details.",
    doctorResponseStep: "Doctor response",
    doctorResponseStepText: "Doctor accepts, rejects, or manages the appointment request.",
    followUpStep: "Care follow-up",
    followUpStepText: "Patient records, allergies, medications, and lab requests stay organized.",
    footerText: "Professional telehealth platform for Afghanistan.",
    getStarted: "Get started",
  },
  fa: {
    language: "زبان",
    english: "انگلیسی",
    dari: "دری",
    pashto: "پښتو",
    signIn: "ورود",
    signOut: "خروج",
    goHome: "صفحه اصلی",
    loading: "در حال بارگذاری حساب...",
    pleaseLogin: "لطفاً اول وارد شوید",
    noSession: "نشست ورود شما پیدا نشد.",
    wrongAccount: "نوع حساب اشتباه است",
    wrongAccountText: "این صفحه برای نوع حساب دیگر است.",
    dashboard: "داشبورد",
    appointments: "نوبت‌ها",
    doctors: "داکتران",
    patients: "مریضان",
    profile: "پروفایل",
    reviews: "نظریات",
    posts: "پست‌ها",
    careCoordination: "هماهنگی مراقبت",
    payments: "پرداخت‌ها",
    users: "کاربران",
    email: "ایمیل",
    password: "رمز عبور",
    fullName: "نام کامل",
    phoneNumber: "شماره تماس",
    confirmPassword: "تایید رمز عبور",
    createAccount: "ساخت حساب",
    login: "ورود",
    signup: "ثبت نام",
    signingIn: "در حال ورود...",
    creatingAccount: "در حال ساخت حساب...",
    enterEmailPassword: "لطفاً ایمیل و رمز عبور را وارد کنید.",
    passwordsNotMatch: "رمزها با هم مطابقت ندارند.",
    passwordLength: "رمز عبور باید حداقل ۶ حرف باشد.",
    specialty: "تخصص",
    licenseNumber: "شماره جواز طبی",
    yearsExperience: "سال‌های تجربه",
    consultationFee: "فیس مشوره",
    homePlatform: "پلتفرم تلی‌صحت افغانستان",
    navFeatures: "ویژگی‌ها",
    navDoctors: "داکتران",
    navHow: "طریقه کار",
    homeBadge: "دسترسی مطمئن به خدمات صحی دیجیتال",
    homeTitle: "با SAMA داکتر پیدا کنید، نوبت بگیرید و مراقبت صحی خود را مدیریت کنید.",
    homeSubtitle:
      "SAMA مریضان، داکتران و ادمین را در یک سیستم امن صحی وصل می‌کند. مریضان می‌توانند داکتر جستجو کنند، نوبت بگیرند، دواها، لابراتوار، حساسیت‌ها و معلومات صحی خود را مدیریت کنند.",
    searchPlaceholder: "جستجوی داکتر، تخصص یا شهر",
    search: "جستجو",
    access: "دسترسی",
    userPortals: "بخش کاربری",
    healthRecords: "اسناد صحی",
    samaCare: "SAMA Care",
    online: "آنلاین",
    verifiedDoctors: "نوبت با داکتران تایید شده",
    chooseDoctor: "انتخاب بر اساس تخصص، شهر، فیس و تجربه.",
    nextAppointment: "نوبت بعدی",
    generalConsultation: "مشوره عمومی",
    todayTime: "امروز · ۴:۳۰ عصر",
    confirm: "تایید",
    medication: "دواها",
    labRequest: "درخواست لابراتوار",
    allergies: "حساسیت‌ها",
    platformFeatures: "ویژگی‌های پلتفرم",
    everythingModernCare: "همه چیز برای مراقبت صحی مدرن",
    builtFor: "ساخته شده برای نوبت‌دهی مریضان، مدیریت داکتران و کنترل ادمین.",
    doctorSearch: "جستجوی داکتر",
    doctorSearchText: "جستجو بر اساس تخصص، شهر، جنسیت، فیس، تجربه و وقت‌های موجود.",
    appointmentBooking: "نوبت‌دهی",
    appointmentBookingText: "مریضان می‌توانند نوبت درخواست کنند و داکتران قبول یا رد کنند.",
    careCoordinationText: "ادمین و تیم مراقبت می‌توانند درخواست‌ها و پیگیری مریضان را مدیریت کنند.",
    patientHealthProfile: "پروفایل صحی مریض",
    patientHealthProfileText: "حساسیت‌ها، یادداشت دوا، پلان تداوی و تاریخچه ویزیت را ذخیره کنید.",
    doctorReviews: "نظریات داکتران",
    doctorReviewsText: "مریضان می‌توانند به داکتران امتیاز دهند و به دیگران کمک کنند.",
    labCommunication: "ارتباط لابراتوار",
    labCommunicationText: "درخواست لابراتوار بسازید و وضعیت تست را پیگیری کنید.",
    findCare: "دریافت خدمات صحی",
    popularSpecialties: "تخصص‌های مشهور",
    bookAppointment: "گرفتن نوبت",
    simpleProcess: "روند ساده",
    howSamaWorks: "SAMA چطور کار می‌کند",
    createAccountStep: "ساخت حساب",
    createAccountStepText: "مریض، داکتر یا ادمین وارد بخش مربوطه می‌شود.",
    searchRequestStep: "جستجو و درخواست",
    searchRequestStepText: "مریض داکتر را پیدا کرده و جزئیات نوبت را ارسال می‌کند.",
    doctorResponseStep: "پاسخ داکتر",
    doctorResponseStepText: "داکتر نوبت را قبول، رد یا مدیریت می‌کند.",
    followUpStep: "پیگیری مراقبت",
    followUpStepText: "اسناد مریض، حساسیت‌ها، دواها و درخواست‌های لابراتوار منظم می‌ماند.",
    footerText: "پلتفرم حرفه‌ای تلی‌صحت برای افغانستان.",
    getStarted: "شروع کنید",
  },
  ps: {
    language: "ژبه",
    english: "انګلیسي",
    dari: "دري",
    pashto: "پښتو",
    signIn: "ننوتل",
    signOut: "وتل",
    goHome: "کور پاڼه",
    loading: "حساب پورته کېږي...",
    pleaseLogin: "مهرباني وکړئ لومړی ننوزئ",
    noSession: "ستاسو د ننوتلو ناسته ونه موندل شوه.",
    wrongAccount: "د حساب ډول ناسم دی",
    wrongAccountText: "دا پاڼه د بل حساب ډول لپاره ده.",
    dashboard: "ډشبورډ",
    appointments: "ملاقاتونه",
    doctors: "ډاکټران",
    patients: "ناروغان",
    profile: "پروفایل",
    reviews: "نظرونه",
    posts: "پوسټونه",
    careCoordination: "د پاملرنې همغږي",
    payments: "تادیات",
    users: "کارنان",
    email: "ایمیل",
    password: "پاسورډ",
    fullName: "بشپړ نوم",
    phoneNumber: "د ټیلیفون شمېره",
    confirmPassword: "پاسورډ تایید کړئ",
    createAccount: "حساب جوړول",
    login: "ننوتل",
    signup: "ثبت نام",
    signingIn: "ننوتل روان دي...",
    creatingAccount: "حساب جوړېږي...",
    enterEmailPassword: "مهرباني وکړئ ایمیل او پاسورډ ولیکئ.",
    passwordsNotMatch: "پاسورډونه سره برابر نه دي.",
    passwordLength: "پاسورډ باید لږ تر لږه ۶ توري وي.",
    specialty: "تخصص",
    licenseNumber: "د طبي جواز شمېره",
    yearsExperience: "د تجربې کلونه",
    consultationFee: "د مشورې فیس",
    homePlatform: "د افغانستان ټیلی روغتیا پلاتفورم",
    navFeatures: "ځانګړتیاوې",
    navDoctors: "ډاکټران",
    navHow: "څنګه کار کوي",
    homeBadge: "د باور وړ ډیجیټل روغتیایي لاسرسی",
    homeTitle: "د SAMA له لارې ډاکټر پیدا کړئ، ملاقات ونیسئ او خپله روغتیایي پاملرنه تنظیم کړئ.",
    homeSubtitle:
      "SAMA ناروغان، ډاکټران او اډمین په یوه خوندي روغتیایي سیستم کې نښلوي. ناروغان کولی شي ډاکټر ولټوي، ملاقات ونیسي، دوا، لابراتوار، حساسیتونه او روغتیایي معلومات تنظیم کړي.",
    searchPlaceholder: "ډاکټر، تخصص یا ښار ولټوئ",
    search: "لټون",
    access: "لاسرسی",
    userPortals: "کارن برخې",
    healthRecords: "روغتیایي اسناد",
    samaCare: "SAMA Care",
    online: "آنلاین",
    verifiedDoctors: "له تایید شوو ډاکټرانو سره ملاقات",
    chooseDoctor: "د تخصص، ښار، فیس او تجربې له مخې انتخاب.",
    nextAppointment: "راتلونکی ملاقات",
    generalConsultation: "عمومي مشوره",
    todayTime: "نن · ۴:۳۰ ماښام",
    confirm: "تایید",
    medication: "دوا",
    labRequest: "لابراتوار غوښتنه",
    allergies: "حساسیتونه",
    platformFeatures: "د پلاتفورم ځانګړتیاوې",
    everythingModernCare: "د عصري روغتیایي پاملرنې لپاره هر څه",
    builtFor: "د ناروغ ملاقات، ډاکټر مدیریت او اډمین کنټرول لپاره جوړ شوی.",
    doctorSearch: "د ډاکټر لټون",
    doctorSearchText: "د تخصص، ښار، جنسیت، فیس، تجربې او وخت له مخې لټون.",
    appointmentBooking: "د ملاقات نیول",
    appointmentBookingText: "ناروغان کولی شي ملاقات وغواړي او ډاکټران یې قبول یا رد کړي.",
    careCoordinationText: "اډمین او د پاملرنې ټیم د ناروغانو غوښتنې او تعقیبونه مدیریت کوي.",
    patientHealthProfile: "د ناروغ روغتیایي پروفایل",
    patientHealthProfileText: "حساسیتونه، د دوا یادښتونه، د درملنې پلان او د لیدنو تاریخچه خوندي کړئ.",
    doctorReviews: "د ډاکټر نظرونه",
    doctorReviewsText: "ناروغان کولی شي ډاکټر ته درجه ورکړي او نورو سره مرسته وکړي.",
    labCommunication: "لابراتوار اړیکه",
    labCommunicationText: "لابراتوار غوښتنې جوړې او د ټیسټ حالت تعقیب کړئ.",
    findCare: "روغتیایي خدمتونه",
    popularSpecialties: "مشهور تخصصونه",
    bookAppointment: "ملاقات نیول",
    simpleProcess: "ساده پروسه",
    howSamaWorks: "SAMA څنګه کار کوي",
    createAccountStep: "حساب جوړول",
    createAccountStepText: "ناروغ، ډاکټر یا اډمین خپل اړوند پورټل ته ننوځي.",
    searchRequestStep: "لټون او غوښتنه",
    searchRequestStepText: "ناروغ ډاکټر پیدا کوي او د ملاقات معلومات لېږي.",
    doctorResponseStep: "د ډاکټر ځواب",
    doctorResponseStepText: "ډاکټر ملاقات قبول، رد یا مدیریت کوي.",
    followUpStep: "د پاملرنې تعقیب",
    followUpStepText: "د ناروغ اسناد، حساسیتونه، دوا او لابراتوار غوښتنې منظم پاتې کېږي.",
    footerText: "د افغانستان لپاره مسلکي ټیلی روغتیا پلاتفورم.",
    getStarted: "پیل وکړئ",
  },
};

type DictionaryKey = keyof typeof dictionary.en;

interface LanguageContextValue {
  lang: Lang;
  isRtl: boolean;
  setLang: (lang: Lang) => void;
  t: (key: DictionaryKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getSafeLang(): Lang {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LANGUAGE_KEY);
  return saved === "fa" || saved === "ps" || saved === "en" ? saved : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(getSafeLang);
  const isRtl = lang === "fa" || lang === "ps";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [lang, isRtl]);

  const setLang = (newLang: Lang) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_KEY, newLang);
    }
  };

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      isRtl,
      setLang,
      t: (key) => dictionary[lang][key] || dictionary.en[key] || key,
    }),
    [lang, isRtl]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context) return context;

  const safeLang = getSafeLang();
  const isRtl = safeLang === "fa" || safeLang === "ps";

  return {
    lang: safeLang,
    isRtl,
    setLang: (newLang: Lang) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(LANGUAGE_KEY, newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === "fa" || newLang === "ps" ? "rtl" : "ltr";
        window.location.reload();
      }
    },
    t: (key) => dictionary[safeLang][key] || dictionary.en[key] || key,
  };
}

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as Lang)}
      aria-label={t("language")}
      className={`rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-emerald-300 ${className}`}
    >
      <option value="en">English</option>
      <option value="fa">دری</option>
      <option value="ps">پښتو</option>
    </select>
  );
}

export function GlobalLanguageButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 print:hidden">
      <LanguageSwitcher />
    </div>
  );
}

export function SamaLogo({ small = false }: { small?: boolean }) {
  return (
    <img
      src="/sama-logo.png"
      alt="SAMA"
      className={small ? "h-10 w-auto object-contain" : "h-16 w-auto object-contain"}
    />
  );
}
