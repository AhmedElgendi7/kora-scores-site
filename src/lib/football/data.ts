export type MatchStatus = "scheduled" | "live" | "finished";
export type MatchImportance = "important" | "normal";

export interface Match {
  id: string;
  competition: { id: string; name: string; country: string };
  home: { id: string; name: string };
  away: { id: string; name: string };
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoff: string;
  minute: number | null;
  importance: MatchImportance;
  venue?: string;
}

export const SAMPLE_DATE = "2026-11-26";
const time = (hhmm: string) => `${SAMPLE_DATE}T${hhmm}:00Z`;

export const sampleMatches: Match[] = [
  { id: "cl-1", competition: { id: "CL", name: "دوري أبطال أوروبا", country: "أوروبا" }, home: { id: "rm", name: "ريال مدريد" }, away: { id: "mc", name: "مانشستر سيتي" }, homeScore: 2, awayScore: 1, status: "live", kickoff: time("19:00"), minute: 63, importance: "important", venue: "سانتياغو برنابيو" },
  { id: "cl-2", competition: { id: "CL", name: "دوري أبطال أوروبا", country: "أوروبا" }, home: { id: "bm", name: "بايرن ميونخ" }, away: { id: "im", name: "إنتر ميلان" }, homeScore: null, awayScore: null, status: "scheduled", kickoff: time("21:00"), minute: null, importance: "important", venue: "أليانز أرينا" },
  { id: "pl-1", competition: { id: "PL", name: "الدوري الإنجليزي", country: "إنجلترا" }, home: { id: "lfc", name: "ليفربول" }, away: { id: "ars", name: "أرسنال" }, homeScore: 1, awayScore: 1, status: "finished", kickoff: time("17:30"), minute: null, importance: "important", venue: "أنفيلد" },
  { id: "pl-2", competition: { id: "PL", name: "الدوري الإنجليزي", country: "إنجلترا" }, home: { id: "che", name: "تشيلسي" }, away: { id: "tot", name: "توتنهام" }, homeScore: null, awayScore: null, status: "scheduled", kickoff: time("20:00"), minute: null, importance: "normal", venue: "ستامفورد بريدج" },
  { id: "pd-1", competition: { id: "PD", name: "الدوري الإسباني", country: "إسبانيا" }, home: { id: "bar", name: "برشلونة" }, away: { id: "atm", name: "أتلتيكو مدريد" }, homeScore: 3, awayScore: 0, status: "finished", kickoff: time("16:15"), minute: null, importance: "important", venue: "كامب نو" },
  { id: "egy-1", competition: { id: "EGY1", name: "الدوري المصري", country: "مصر" }, home: { id: "ahly", name: "الأهلي" }, away: { id: "zam", name: "الزمالك" }, homeScore: 0, awayScore: 0, status: "live", kickoff: time("18:00"), minute: 28, importance: "important", venue: "استاد القاهرة الدولي" },
  { id: "egy-2", competition: { id: "EGY1", name: "الدوري المصري", country: "مصر" }, home: { id: "pyr", name: "بيراميدز" }, away: { id: "mas", name: "المصري" }, homeScore: null, awayScore: null, status: "scheduled", kickoff: time("20:30"), minute: null, importance: "normal", venue: "استاد الدفاع الجوي" },
];

export const statusLabels: Record<MatchStatus, string> = {
  scheduled: "قادمة",
  live: "مباشر",
  finished: "انتهت",
};

export function todayIso(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo" }).format(new Date());
}

export function shiftDate(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatArabicDate(iso: string): string {
  return new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Cairo" }).format(new Date(`${iso}T12:00:00Z`));
}

export function formatArabicTime(iso: string): string {
  return new Intl.DateTimeFormat("ar-EG", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" }).format(new Date(iso));
}

export function matchesForDate(date: string): Match[] {
  return sampleMatches.map((match) => ({ ...match, kickoff: `${date}${match.kickoff.slice(10)}` }));
}
