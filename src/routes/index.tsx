import { createFileRoute } from "@tanstack/react-router";
import { LanguageSwitcher, SamaLogo, useLanguage } from "@/lib/language";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAMA — Afghanistan Telehealth Platform" },
      { name: "description", content: "Find doctors, book appointments, and manage care with SAMA." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useLanguage();
  const goTo = (path: string) => { window.location.href = path; };

  const specialties = ["General Physician", "Pediatrician", "Cardiologist", "Dermatologist", "Gynecologist", "Dentist"];
  const doctors = [
    { name: "Dr. Ahmad Wali", specialty: "General Physician", location: "Kabul", experience: "9 years", fee: "500 AFN", rating: "4.9" },
    { name: "Dr. Farah Naz", specialty: "Pediatrician", location: "Herat", experience: "7 years", fee: "650 AFN", rating: "4.8" },
    { name: "Dr. Sameer Khan", specialty: "Cardiologist", location: "Mazar", experience: "12 years", fee: "900 AFN", rating: "4.9" },
  ];

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <a href="/" style={styles.brandWrap}>
          <SamaLogo small />
          <div>
            <div style={styles.brand}>SAMA</div>
            <div style={styles.brandSub}>{t("homePlatform")}</div>
          </div>
        </a>

        <nav style={styles.nav}>
          <a href="#features" style={styles.navLink}>{t("navFeatures")}</a>
          <a href="#doctors" style={styles.navLink}>{t("navDoctors")}</a>
          <a href="#how" style={styles.navLink}>{t("navHow")}</a>
        </nav>

        <div style={styles.headerActions}>
          <LanguageSwitcher />
          <button style={styles.smallBtn} onClick={() => goTo("/auth/patient")}>{t("signIn")}</button>
        </div>
      </header>

      <section style={styles.hero}>
        <div>
          <span style={styles.badge}>{t("homeBadge")}</span>
          <h1 style={styles.title}>{t("homeTitle")}</h1>
          <p style={styles.subtitle}>{t("homeSubtitle")}</p>

          <div style={styles.searchBox}>
            <input style={styles.searchInput} placeholder={t("searchPlaceholder")} />
            <button style={styles.searchBtn}>{t("search")}</button>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.stat}><strong>24/7</strong><span>{t("access")}</span></div>
            <div style={styles.stat}><strong>3</strong><span>{t("userPortals")}</span></div>
            <div style={styles.stat}><strong>Secure</strong><span>{t("healthRecords")}</span></div>
          </div>
        </div>

        <div style={styles.heroRight}>
          <div style={styles.phoneCard}>
            <div style={styles.phoneTop}><span>{t("samaCare")}</span><strong>{t("online")}</strong></div>
            <div style={styles.doctorMini}>
              <div style={styles.avatar}>+</div>
              <div><strong>{t("verifiedDoctors")}</strong><p>{t("chooseDoctor")}</p></div>
            </div>
            <div style={styles.appointmentCard}>
              <div><span style={styles.label}>{t("nextAppointment")}</span><h3>{t("generalConsultation")}</h3><p>{t("todayTime")}</p></div>
              <button style={styles.confirmBtn}>{t("confirm")}</button>
            </div>
            <div style={styles.healthGrid}>
              <div style={styles.healthItem}>💊 {t("medication")}</div>
              <div style={styles.healthItem}>🧪 {t("labRequest")}</div>
              <div style={styles.healthItem}>⭐ {t("reviews")}</div>
              <div style={styles.healthItem}>📋 {t("allergies")}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.badge}>{t("platformFeatures")}</span>
          <h2 style={styles.sectionTitle}>{t("everythingModernCare")}</h2>
          <p style={styles.sectionText}>{t("builtFor")}</p>
        </div>
        <div style={styles.featureGrid}>
          <Feature title={t("doctorSearch")} text={t("doctorSearchText")} />
          <Feature title={t("appointmentBooking")} text={t("appointmentBookingText")} />
          <Feature title={t("careCoordination")} text={t("careCoordinationText")} />
          <Feature title={t("patientHealthProfile")} text={t("patientHealthProfileText")} />
          <Feature title={t("doctorReviews")} text={t("doctorReviewsText")} />
          <Feature title={t("labCommunication")} text={t("labCommunicationText")} />
        </div>
      </section>

      <section id="doctors" style={styles.sectionAlt}>
        <div style={styles.sectionHeader}>
          <span style={styles.badge}>{t("findCare")}</span>
          <h2 style={styles.sectionTitle}>{t("popularSpecialties")}</h2>
        </div>
        <div style={styles.specialtyRow}>{specialties.map((s) => <button key={s} style={styles.specialtyBtn}>{s}</button>)}</div>
        <div style={styles.doctorGrid}>
          {doctors.map((doctor) => (
            <div key={doctor.name} style={styles.doctorCard}>
              <div style={styles.doctorHeader}>
                <div style={styles.doctorAvatar}>{doctor.name.charAt(3)}</div>
                <div><h3>{doctor.name}</h3><p>{doctor.specialty}</p></div>
              </div>
              <div style={styles.doctorMeta}>
                <span>📍 {doctor.location}</span><span>🩺 {doctor.experience}</span><span>💰 {doctor.fee}</span><span>⭐ {doctor.rating}</span>
              </div>
              <button style={styles.bookBtn} onClick={() => goTo("/auth/patient")}>{t("bookAppointment")}</button>
            </div>
          ))}
        </div>
      </section>

      <section id="how" style={styles.section}>
        <div style={styles.sectionHeader}>
          <span style={styles.badge}>{t("simpleProcess")}</span>
          <h2 style={styles.sectionTitle}>{t("howSamaWorks")}</h2>
        </div>
        <div style={styles.steps}>
          <Step number="01" title={t("createAccountStep")} text={t("createAccountStepText")} />
          <Step number="02" title={t("searchRequestStep")} text={t("searchRequestStepText")} />
          <Step number="03" title={t("doctorResponseStep")} text={t("doctorResponseStepText")} />
          <Step number="04" title={t("followUpStep")} text={t("followUpStepText")} />
        </div>
      </section>

      <footer style={styles.footer}>
        <div><strong>SAMA</strong><p>{t("footerText")}</p></div>
        <button style={styles.primaryBtn} onClick={() => goTo("/auth/patient")}>{t("getStarted")}</button>
      </footer>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return <div style={styles.featureCard}><div style={styles.featureIcon}>+</div><h3>{title}</h3><p>{text}</p></div>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div style={styles.stepCard}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6fbff", color: "#0f172a", fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" },
  header: { maxWidth: 1180, margin: "0 auto", padding: "22px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 },
  brandWrap: { display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" },
  brand: { fontWeight: 900, fontSize: 20 },
  brandSub: { fontSize: 12, color: "#64748b" },
  nav: { display: "flex", gap: 20 },
  navLink: { color: "#334155", textDecoration: "none", fontSize: 14, fontWeight: 700 },
  headerActions: { display: "flex", alignItems: "center", gap: 10 },
  smallBtn: { border: "none", background: "#0f766e", color: "white", padding: "10px 16px", borderRadius: 999, fontWeight: 800, cursor: "pointer" },
  hero: { maxWidth: 1180, margin: "0 auto", padding: "70px 18px 50px", display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 44, alignItems: "center" },
  badge: { display: "inline-block", background: "#dcfce7", color: "#047857", border: "1px solid #bbf7d0", padding: "8px 13px", borderRadius: 999, fontSize: 13, fontWeight: 800 },
  title: { margin: "18px 0 16px", fontSize: 56, lineHeight: 1.04, letterSpacing: "-0.05em", fontWeight: 950 },
  subtitle: { color: "#475569", fontSize: 18, lineHeight: 1.7 },
  searchBox: { marginTop: 26, background: "white", border: "1px solid #dbeafe", borderRadius: 20, padding: 10, display: "flex", maxWidth: 620 },
  searchInput: { flex: 1, border: "none", outline: "none", padding: "15px 14px", fontSize: 15 },
  searchBtn: { border: "none", background: "#0b5eea", color: "white", borderRadius: 14, padding: "0 24px", fontWeight: 900, cursor: "pointer" },
  statsRow: { marginTop: 32, display: "flex", gap: 18, flexWrap: "wrap" },
  stat: { background: "white", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 18px", display: "grid", gap: 4 },
  heroRight: { display: "flex", justifyContent: "center" },
  phoneCard: { width: "100%", maxWidth: 410, background: "white", border: "1px solid #bfdbfe", borderRadius: 34, padding: 24, boxShadow: "0 35px 90px rgba(15, 23, 42, 0.16)" },
  phoneTop: { display: "flex", justifyContent: "space-between", marginBottom: 22 },
  doctorMini: { background: "#f8fafc", borderRadius: 24, padding: 18, display: "flex", gap: 14, alignItems: "center" },
  avatar: { width: 54, height: 54, borderRadius: 18, background: "#0f766e", color: "white", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 22 },
  appointmentCard: { marginTop: 18, padding: 18, borderRadius: 24, background: "#0b5eea", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 12, opacity: 0.82 },
  confirmBtn: { border: "none", background: "white", color: "#0b5eea", borderRadius: 12, padding: "10px 13px", fontWeight: 900 },
  healthGrid: { marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  healthItem: { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 18, padding: 15, fontWeight: 800 },
  section: { maxWidth: 1180, margin: "0 auto", padding: "70px 18px" },
  sectionAlt: { background: "#ffffff", padding: "70px 18px" },
  sectionHeader: { maxWidth: 720, margin: "0 auto 34px", textAlign: "center" },
  sectionTitle: { fontSize: 40, margin: "14px 0 10px" },
  sectionText: { color: "#64748b", fontSize: 17 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
  featureCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 },
  featureIcon: { width: 42, height: 42, borderRadius: 14, background: "#e0f2fe", color: "#0b5eea", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 22 },
  specialtyRow: { maxWidth: 980, margin: "0 auto 30px", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  specialtyBtn: { border: "1px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", borderRadius: 999, padding: "11px 16px", fontWeight: 800 },
  doctorGrid: { maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 },
  doctorCard: { border: "1px solid #e2e8f0", borderRadius: 24, padding: 22, background: "#f8fafc" },
  doctorHeader: { display: "flex", gap: 14, alignItems: "center" },
  doctorAvatar: { width: 56, height: 56, borderRadius: 18, background: "linear-gradient(135deg, #12b981, #0b5eea)", color: "white", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 20 },
  doctorMeta: { marginTop: 18, display: "grid", gap: 8, color: "#475569", fontSize: 14 },
  bookBtn: { marginTop: 20, width: "100%", border: "none", background: "#0f766e", color: "white", padding: "13px", borderRadius: 14, fontWeight: 900, cursor: "pointer" },
  steps: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 },
  stepCard: { background: "white", border: "1px solid #e2e8f0", borderRadius: 24, padding: 24 },
  footer: { maxWidth: 1180, margin: "0 auto", padding: "34px 18px 46px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" },
  primaryBtn: { border: "none", background: "linear-gradient(135deg, #0f766e, #0b5eea)", color: "white", padding: "14px 20px", borderRadius: 14, fontWeight: 900, cursor: "pointer" },
};
