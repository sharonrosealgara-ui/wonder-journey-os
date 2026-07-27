"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getInquiries, updateInquiryStatus } from "./actions";
import { PageHeader } from "@/components/page-header";
import { TeacherOnly } from "@/components/teacher-only";
import { badges } from "@/config/badges";
import { students } from "@/config/family";
import { lessons } from "@/config/lessons";
import {
  formatDate,
  KEYS,
  todayISO,
  type AwardedBadge,
  type CookbookMemory,
  type GratitudeEntry,
  type JournalEntry,
  type LessonCompletion,
} from "@/lib/app-state";
import { newId, useStored } from "@/lib/storage";

export default function TeacherPage() {
  return (
    <TeacherOnly>
      <TeacherContent />
    </TeacherOnly>
  );
}

function TeacherContent() {
  const [completions] = useStored<LessonCompletion[]>(KEYS.completions, []);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [journal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [cookbook] = useStored<CookbookMemory[]>(KEYS.cookbook, []);
  const [awards, setAwards] = useStored<AwardedBadge[]>(KEYS.awards, []);

  // award badge form
  const [badgeStudent, setBadgeStudent] = useState(students[0]?.id ?? "");
  const [badgeId, setBadgeId] = useState(badges[0]?.id ?? "");
  const [badgeNote, setBadgeNote] = useState("");
  const [justAwarded, setJustAwarded] = useState(false);

  function awardBadge() {
    setAwards((prev) => [
      { id: newId(), badgeId, studentId: badgeStudent, date: todayISO(), note: badgeNote.trim() },
      ...prev,
    ]);
    setBadgeNote("");
    setJustAwarded(true);
    setTimeout(() => setJustAwarded(false), 2500);
  }

  const [inquiries, setInquiries] = useState<any[]>([]);
  useEffect(() => {
    getInquiries().then(setInquiries);
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    const success = await updateInquiryStatus(id, status);
    if (success) {
      setInquiries((prev) => prev.map((iq) => (iq.id === id ? { ...iq, status } : iq)));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        emoji="🍎"
        title="Teacher Dashboard"
        subtitle="Welcome back, Teacher Sharon! Here's your classroom at a glance."
      />

      {/* Students overview */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold">🎒 Students</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {students.map((s) => {
            const done = completions.filter((c) => c.studentId === s.id).length;
            const grat = gratitude.filter((g) => g.studentId === s.id).length;
            const badgeCount = awards.filter((a) => a.studentId === s.id).length;
            return (
              <div key={s.id} className="rounded-2xl border-2 p-4" style={{ borderColor: `${s.color}55` }}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.emoji}</span>
                  <div>
                    <div className="font-display font-extrabold">{s.name}</div>
                    <div className="text-xs text-ink-soft">Age {s.age}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-ink-soft">
                  ✅ {done} lessons · 🙏 {grat} blessings · 🏅 {badgeCount} badges
                </div>
                <div className="mt-1 text-xs text-ink-soft">{s.interests.slice(0, 3).join(" · ")}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lesson plan */}
      <section className="wj-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">📚 Lesson plan</h2>
          <Link href="/teacher/whatsapp" className="wj-btn wj-btn-ocean text-sm">
            WhatsApp Helper 📱
          </Link>
        </div>
        <div className="mt-4 space-y-2">
          {lessons
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((l) => {
              const doneCount = new Set(completions.filter((c) => c.lessonId === l.id).map((c) => c.studentId)).size;
              return (
                <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-sand-deep p-3">
                  <span className="text-2xl">{l.emoji}</span>
                  <div className="min-w-40 flex-1">
                    <div className="font-display font-extrabold">
                      Lesson {l.order}: {l.title}
                    </div>
                    <div className="text-sm text-ink-soft">
                      {formatDate(l.date)} · {l.time} · {doneCount}/{students.length} students completed
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/adventure/${l.id}`} className="wj-chip !bg-sunset !text-white hover:!bg-sunset-deep">
                      🎬 Start
                    </Link>
                    <a href={l.canvaLink} target="_blank" rel="noopener noreferrer" className="wj-chip hover:bg-mango/20">
                      🎨 Canva
                    </a>
                    {l.videoLinks[0] && (
                      <a href={l.videoLinks[0].url} target="_blank" rel="noopener noreferrer" className="wj-chip hover:bg-mango/20">
                        🎬 Video
                      </a>
                    )}
                    <Link href={`/lessons/${l.id}`} className="wj-chip hover:bg-mango/20">
                      Open →
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
        <p className="mt-4 rounded-2xl bg-sand p-3 text-xs text-ink-soft">
          ✏️ To add a lesson or update a Canva/video link, edit <b>src/config/lessons.ts</b> —
          the lesson page, schedule, prep email, and passport stamps update automatically.
        </p>
      </section>

      {/* Award a badge */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold">🏅 Award a badge</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-ink-soft">Student</label>
            <select className="wj-input mt-1" value={badgeStudent} onChange={(e) => setBadgeStudent(e.target.value)}>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-ink-soft">Badge</label>
            <select className="wj-input mt-1" value={badgeId} onChange={(e) => setBadgeId(e.target.value)}>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.emoji} {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <input
          className="wj-input mt-3"
          placeholder="Note (optional) — e.g., 'Bravely said Kumusta to the whole family!'"
          value={badgeNote}
          onChange={(e) => setBadgeNote(e.target.value)}
        />
        <button className="wj-btn mt-3" onClick={awardBadge}>
          {justAwarded ? "Badge awarded! 🎉" : "Award badge 🏅"}
        </button>
      </section>

      {/* Inquiries */}
      <section className="wj-card p-6">
        <h2 className="font-display text-xl font-extrabold mb-4">📬 Client Inquiries</h2>
        <div className="space-y-4">
          {inquiries.length === 0 ? (
            <p className="text-ink-soft text-sm">No inquiries yet.</p>
          ) : (
            inquiries.map((iq) => (
              <div key={iq.id} className="border border-sand-deep rounded-2xl p-4 bg-white/50 flex flex-col md:flex-row gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ocean-deep">{iq.full_name}</span>
                    <span className="text-xs bg-sand px-2 py-0.5 rounded-full">{iq.client_type}</span>
                  </div>
                  <div className="text-sm text-ink-soft mt-1">
                    {iq.email} {iq.whatsapp_number && `· WhatsApp: ${iq.whatsapp_number}`}
                  </div>
                  <div className="text-sm text-ink-soft">
                    <b>Interested in:</b> {iq.interested_service} · <b>Ages:</b> {iq.learner_ages || 'N/A'}
                  </div>
                  <div className="mt-2 text-sm bg-sand/50 p-3 rounded-xl italic">
                    "{iq.message}"
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[140px]">
                  <select 
                    className="wj-input text-sm" 
                    value={iq.status} 
                    onChange={(e) => handleStatusChange(iq.id, e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="archived">Archived</option>
                  </select>
                  {iq.whatsapp_number && (
                    <a 
                      href={`https://wa.me/${iq.whatsapp_number.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="wj-btn wj-btn-ghost text-xs text-center border border-sand-deep"
                    >
                      Message on WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recent activity */}
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="wj-card p-6">
          <h2 className="font-display text-lg font-extrabold">🙏 Recent blessings & journals</h2>
          <div className="mt-3 space-y-2 text-sm">
            {[...gratitude.slice(0, 3)].map((g) => (
              <p key={g.id} className="rounded-xl bg-sand p-2">
                <b>{students.find((s) => s.id === g.studentId)?.name}:</b> {g.text}
              </p>
            ))}
            {journal.slice(0, 2).map((j) => (
              <p key={j.id} className="rounded-xl bg-ocean/5 p-2">
                <b>{students.find((s) => s.id === j.studentId)?.name} (journal):</b> {j.title}
              </p>
            ))}
            {gratitude.length === 0 && journal.length === 0 && (
              <p className="text-ink-soft">Nothing yet — entries appear here as students write.</p>
            )}
          </div>
          <Link href="/journal" className="mt-3 inline-block text-sm font-bold text-sunset-deep hover:underline">
            View all →
          </Link>
        </section>
        <section className="wj-card p-6">
          <h2 className="font-display text-lg font-extrabold">📖 Cookbook uploads</h2>
          <div className="mt-3 space-y-2 text-sm">
            {cookbook.slice(0, 4).map((m) => (
              <p key={m.id} className="rounded-xl bg-sand p-2">
                <b>{m.cookNames}</b> — {formatDate(m.date)} {m.photo ? "📸" : ""}
              </p>
            ))}
            {cookbook.length === 0 && (
              <p className="text-ink-soft">No cookbook memories yet — the first recipe is coming!</p>
            )}
          </div>
          <Link href="/cookbook" className="mt-3 inline-block text-sm font-bold text-sunset-deep hover:underline">
            Open cookbook →
          </Link>
        </section>
      </div>
    </div>
  );
}
