"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Match, MatchStatus } from "@/lib/football/data";
import { SAMPLE_DATE, formatArabicDate, formatArabicTime, matchesForDate, sampleMatches, shiftDate, statusLabels, todayIso } from "@/lib/football/data";

const statusOptions: Array<{ value: "all" | MatchStatus; label: string }> = [
  { value: "all", label: "الكل" },
  { value: "live", label: "مباشر" },
  { value: "finished", label: "انتهت" },
  { value: "scheduled", label: "قادمة" },
];

function DateStrip({ selected, onSelect }: { selected: string; onSelect: (date: string) => void }) {
  const days = Array.from({ length: 7 }, (_, index) => shiftDate(selected, index - 3));
  const weekday = new Intl.DateTimeFormat("ar-EG", { weekday: "short", timeZone: "UTC" });
  const dayNumber = new Intl.DateTimeFormat("ar-EG", { day: "numeric", timeZone: "UTC" });
  return (
    <div className="date-strip" aria-label="اختيار التاريخ">
      {days.map((day) => {
        const date = new Date(`${day}T12:00:00Z`);
        const active = day === selected;
        return (
          <button key={day} type="button" aria-pressed={active} className={`day-button${active ? " selected" : ""}`} onClick={() => onSelect(day)}>
            <span className="day-name">{weekday.format(date)}</span>
            <span className="day-number">{dayNumber.format(date)}</span>
          </button>
        );
      })}
    </div>
  );
}

function MatchRow({ match }: { match: Match }) {
  const label = match.status === "live" && match.minute ? `${match.minute}′` : match.status === "scheduled" ? formatArabicTime(match.kickoff) : statusLabels[match.status];
  return (
    <Link className="match-row" href={`/match/${match.id}`}>
      <span className={`match-state${match.status === "live" ? " live-state" : ""}`}>
        {match.status === "live" ? <span className="live-dot" /> : null}{label}
      </span>
      <span className="team-score">
        <span className="team-name">{match.home.name}</span><span className="score">{match.homeScore ?? "-"}</span>
        <span className="team-name">{match.away.name}</span><span className="score">{match.awayScore ?? "-"}</span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  const [date, setDate] = useState(SAMPLE_DATE);
  const [status, setStatus] = useState<"all" | MatchStatus>("all");
  const [competition, setCompetition] = useState("all");
  const [importantOnly, setImportantOnly] = useState(false);

  useEffect(() => setDate(todayIso()), []);

  const matches = useMemo(() => matchesForDate(date), [date]);
  const competitions = useMemo(() => {
    const map = new Map<string, string>();
    matches.forEach((match) => map.set(match.competition.id, match.competition.name));
    return [...map.entries()];
  }, [matches]);
  const visible = useMemo(() => matches.filter((match) => {
    if (status !== "all" && match.status !== status) return false;
    if (competition !== "all" && match.competition.id !== competition) return false;
    if (importantOnly && match.importance !== "important") return false;
    return true;
  }), [matches, status, competition, importantOnly]);
  const groups = useMemo(() => {
    const map = new Map<string, { name: string; country: string; matches: Match[] }>();
    visible.forEach((match) => {
      const group = map.get(match.competition.id) ?? { name: match.competition.name, country: match.competition.country, matches: [] };
      group.matches.push(match);
      map.set(match.competition.id, group);
    });
    return [...map.entries()];
  }, [visible]);
  const liveCount = matches.filter((match) => match.status === "live").length;

  return (
    <main className="page">
      <header className="site-header">
        <div className="brand"><h1>ماتش داي</h1><p>نتائج ومواعيد مباريات كرة القدم</p></div>
        <div className="mark" aria-hidden="true">م</div>
      </header>

      <p className="section-label">اختار اليوم</p>
      <DateStrip selected={date} onSelect={setDate} />
      <div className="summary">
        <strong>{formatArabicDate(date)}</strong>
        <small>{liveCount ? `${liveCount} مباراة مباشرة` : "لا مباريات مباشرة الآن"}</small>
      </div>

      <div className="filters" aria-label="فلترة المباريات">
        {statusOptions.map((option) => (
          <button key={option.value} type="button" aria-pressed={status === option.value} className={`filter-button${status === option.value ? " active" : ""}`} onClick={() => setStatus(option.value)}>{option.label}</button>
        ))}
        <button type="button" aria-pressed={importantOnly} className={`filter-button${importantOnly ? " active" : ""}`} onClick={() => setImportantOnly((value) => !value)}>المهمة فقط</button>
        <select className="competition-select" aria-label="اختيار البطولة" value={competition} onChange={(event) => setCompetition(event.target.value)}>
          <option value="all">كل البطولات</option>
          {competitions.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
        </select>
      </div>

      {groups.length === 0 ? <p className="empty-state">لا توجد مباريات مطابقة للفلتر</p> : groups.map(([id, group]) => (
        <section className="league-card" key={id}>
          <header className="league-header"><span>{group.name}</span><span>{group.country}</span></header>
          {group.matches.map((match) => <MatchRow key={match.id} match={match} />)}
        </section>
      ))}

      <aside className="notice">
        البيانات المعروضة تجريبية للعرض فقط وليست نتائج مباشرة فعلية. هتفضل تجريبية لحد ما يتضاف مفتاح بيانات آمن في إعدادات البناء، من غير ما يظهر في ملفات الموقع العامة.
      </aside>
      <footer className="section-label" style={{ textAlign: "center", marginTop: 18 }}>ماتش داي · واجهة عربية للمباريات</footer>
      <span hidden>{sampleMatches.length}</span>
    </main>
  );
}
