const SPECIALTIES = [
  "General Practice",
  "Cardiology",
  "Pediatrics",
  "Dermatology",
  "Gynecology",
  "Psychiatry",
  "Orthopedics",
  "Internal Medicine",
  "Ophthalmology",
  "ENT"
];
const fmtAFN = (n) => {
  if (n == null) return "—";
  const v = typeof n === "string" ? Number(n) : n;
  return `${v.toLocaleString()} AFN`;
};
const statusColor = {
  pending: "bg-warning/15 text-warning-foreground border-warning/40",
  confirmed: "bg-primary/15 text-primary border-primary/40",
  rejected: "bg-destructive/15 text-destructive border-destructive/40",
  completed: "bg-success/15 text-success border-success/40",
  approved: "bg-success/15 text-success border-success/40",
  unpaid: "bg-warning/15 text-warning-foreground border-warning/40",
  paid: "bg-success/15 text-success border-success/40",
  refunded: "bg-muted text-muted-foreground border-border"
};
export {
  SPECIALTIES as S,
  fmtAFN as f,
  statusColor as s
};
