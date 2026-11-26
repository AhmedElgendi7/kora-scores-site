import Link from "next/link";
import { notFound } from "next/navigation";
import { formatArabicDate, formatArabicTime, sampleMatches, statusLabels } from "@/lib/football/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return sampleMatches.map((match) => ({ id: match.id }));
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const match = sampleMatches.find((item) => item.id === id);
  if (!match) notFound();

  return (
    <main className="page match-detail">
      <Link className="back-link" href="/">رجوع لكل المباريات</Link>
      <p className="competition-line">{match.competition.name} · {match.competition.country}</p>
      <section className="scoreboard" aria-label="نتيجة المباراة">
        <div className="team-side">{match.home.name}</div>
        <div className="score-large">{match.homeScore ?? "-"} : {match.awayScore ?? "-"}</div>
        <div className="team-side">{match.away.name}</div>
      </section>
      <p className="match-meta">
        {statusLabels[match.status]}{match.status === "live" && match.minute ? ` · الدقيقة ${match.minute}` : ""}
        <br />{formatArabicTime(match.kickoff)} · {formatArabicDate(match.kickoff.slice(0, 10))}
        {match.venue ? <><br />{match.venue}</> : null}
      </p>
      <aside className="notice">بيانات المباراة دي تجريبية للتوضيح وليست نتيجة مباشرة مؤكدة.</aside>
    </main>
  );
}
