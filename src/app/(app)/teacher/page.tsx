"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Users, BookOpen, MessageCircle, Play, Video,
  Medal, Mail, Camera, LayoutDashboard,
  CheckCircle2, FileText, Image as ImageIcon, Send
} from "lucide-react";
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
  getLessonDisplayStatus
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
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);

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

  // derived KPIs
  const totalStudents = students.length;
  const totalLessons = lessons.length;
  const totalCompletions = completions.length;
  const totalBadges = awards.length;

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-sand pb-4">
        <PageHeader
          icon={<LayoutDashboard className="w-7 h-7 text-ink" />}
          title="Operations"
          subtitle="Studio Overview & Command Center"
        />
      </div>

      {/* ── KPI Strip ────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Enrolled Students" value={totalStudents} />
        <KPICard label="Curriculum Lessons" value={totalLessons} />
        <KPICard label="Total Completions" value={totalCompletions} />
        <KPICard label="Badges Awarded" value={totalBadges} />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* ── Student Overview ─────────────────────────────────── */}
          <section className="wj-card border border-sand bg-white shadow-sm overflow-hidden">
            <div className="bg-sand-deep/30 px-5 py-3 border-b border-sand flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <Users className="w-4 h-4" /> Learner Profiles
              </h2>
            </div>
            <div className="p-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((s) => {
                const done = completions.filter((c) => c.studentId === s.id).length;
                const grat = gratitude.filter((g) => g.studentId === s.id).length;
                const badgeCount = awards.filter((a) => a.studentId === s.id).length;
                return (
                  <div key={s.id} className="border border-sand rounded-xl p-4 flex flex-col hover:border-sand-deep transition-colors">
                    <div className="flex items-center gap-3 border-b border-sand/50 pb-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: s.color }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-ink leading-tight">{s.name}</div>
                        <div className="text-xs text-ink-soft">Age {s.age}</div>
                      </div>
                    </div>
                    <div className="text-xs text-ink-soft space-y-1.5 flex-1">
                      <div className="flex justify-between"><span>Lessons:</span> <span className="font-medium text-ink">{done}</span></div>
                      <div className="flex justify-between"><span>Blessings:</span> <span className="font-medium text-ink">{grat}</span></div>
                      <div className="flex justify-between"><span>Badges:</span> <span className="font-medium text-ink">{badgeCount}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Lesson Plan ──────────────────────────────────────── */}
          <section className="wj-card border border-sand bg-white shadow-sm overflow-hidden">
            <div className="bg-sand-deep/30 px-5 py-3 border-b border-sand flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Lesson Deployment
              </h2>
            </div>
            <div className="divide-y divide-sand max-h-[500px] overflow-y-auto">
              {lessons
                .slice()
                .sort((a, b) => a.order - b.order)
                .map((l) => {
                  const doneCount = new Set(completions.filter((c) => c.lessonId === l.id).map((c) => c.studentId)).size;
                  const status = getLessonDisplayStatus(l.id, l.date, completions, activeStudentId);
                  return (
                    <div key={l.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sand/30 transition-colors">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-10 text-center font-semibold text-ink-soft bg-sand-deep rounded-md py-1 text-xs uppercase">
                          L{l.order}
                        </div>
                        <div>
                          <div className="font-semibold text-ink">
                            {l.title}
                          </div>
                          <div className="text-xs text-ink-soft mt-0.5 flex items-center gap-2">
                            <span>{formatDate(l.date)}</span>
                            <span>&bull;</span>
                            <span className={doneCount === students.length ? "text-palm-deep font-medium" : ""}>
                              {doneCount}/{students.length} completed
                            </span>
                            <span>&bull;</span>
                            <span className="uppercase tracking-wide text-[10px] font-bold">{status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/adventure/${l.id}`} className="wj-btn wj-btn-ocean text-xs !py-1.5 shadow-sm">
                          <Play className="w-3.5 h-3.5" /> Start
                        </Link>
                        {l.videoLinks[0] && (
                          <a href={l.videoLinks[0].url} target="_blank" rel="noopener noreferrer" className="wj-btn wj-btn-ghost text-xs !py-1.5 border border-sand">
                            <Video className="w-3.5 h-3.5" /> Video
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        </div>

        {/* Right Column: Actions & Inquiries */}
        <div className="space-y-6">
          {/* ── Quick Actions ──────────────────────────────────────── */}
          <section className="wj-card border border-sand bg-white shadow-sm overflow-hidden">
             <div className="bg-sand-deep/30 px-5 py-3 border-b border-sand">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft flex items-center gap-2">
                 Quick Actions
              </h2>
            </div>
            <div className="p-4 grid gap-2">
               <Link href="/classroom" className="flex items-center gap-3 p-3 rounded-xl border border-sand hover:bg-sand/50 transition-colors text-ink">
                  <div className="bg-ocean/10 p-2 rounded-lg text-ocean-deep"><Video className="w-5 h-5" /></div>
                  <div className="font-semibold text-sm">Start Classroom</div>
               </Link>
               <Link href="/photos" className="flex items-center gap-3 p-3 rounded-xl border border-sand hover:bg-sand/50 transition-colors text-ink">
                  <div className="bg-mango/10 p-2 rounded-lg text-mango-deep"><ImageIcon className="w-5 h-5" /></div>
                  <div className="font-semibold text-sm">Photo Studio</div>
               </Link>
               <Link href="/teacher/whatsapp" className="flex items-center gap-3 p-3 rounded-xl border border-sand hover:bg-sand/50 transition-colors text-ink">
                  <div className="bg-palm/10 p-2 rounded-lg text-palm-deep"><MessageCircle className="w-5 h-5" /></div>
                  <div className="font-semibold text-sm">WhatsApp Helper</div>
               </Link>
            </div>
          </section>

          {/* ── Issue Badge ────────────────────────────────────────── */}
          <section className="wj-card border border-sand bg-white shadow-sm overflow-hidden">
            <div className="bg-sand-deep/30 px-5 py-3 border-b border-sand flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <Medal className="w-4 h-4" /> Issue Badge
              </h2>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <select className="wj-input text-sm bg-sand/30" value={badgeStudent} onChange={(e) => setBadgeStudent(e.target.value)}>
                <option value="" disabled>Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <select className="wj-input text-sm bg-sand/30" value={badgeId} onChange={(e) => setBadgeId(e.target.value)}>
                <option value="" disabled>Select Badge</option>
                {badges.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <input
                className="wj-input text-sm bg-sand/30"
                placeholder="Optional Note"
                value={badgeNote}
                onChange={(e) => setBadgeNote(e.target.value)}
              />
              <button className="wj-btn wj-btn-ocean mt-2 shadow-sm" onClick={awardBadge} disabled={justAwarded}>
                {justAwarded ? (
                  <><CheckCircle2 className="w-4 h-4" /> Awarded</>
                ) : (
                  <><Medal className="w-4 h-4" /> Issue</>
                )}
              </button>
            </div>
          </section>

          {/* ── Client Inquiries ───────────────────────────────────── */}
          <section className="wj-card border border-sand bg-white shadow-sm overflow-hidden">
            <div className="bg-sand-deep/30 px-5 py-3 border-b border-sand flex items-center justify-between">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <Mail className="w-4 h-4" /> Inquiries
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {inquiries.length === 0 ? (
                <EmptyState icon={<Mail className="w-6 h-6" />} title="No Inquiries" description="No new client inquiries at this time." />
              ) : (
                inquiries.map((iq) => (
                  <div key={iq.id} className="border border-sand rounded-xl p-4 flex flex-col gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-ink">{iq.full_name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-sand-deep text-ink-soft px-2 py-0.5 rounded-sm">{iq.client_type}</span>
                      </div>
                      <div className="text-xs text-ink-soft mt-1">
                        {iq.email}
                      </div>
                    </div>
                    <div className="text-xs text-ink p-3 rounded-lg bg-sand/50 italic border border-sand">
                      "{iq.message}"
                    </div>
                    <div className="flex items-center gap-2">
                       <select
                        className="wj-input text-xs !py-1 flex-1 bg-white"
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
                          className="wj-btn wj-btn-ghost !py-1.5 px-2 border border-sand"
                          title="Message on WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ── Content Activity ───────────────────────────────────── */}
          <section className="wj-card border border-sand bg-white shadow-sm overflow-hidden">
            <div className="bg-sand-deep/30 px-5 py-3 border-b border-sand">
              <h2 className="font-semibold text-sm uppercase tracking-wider text-ink-soft flex items-center gap-2">
                <FileText className="w-4 h-4" /> Activity Feed
              </h2>
            </div>
            <div className="p-4 space-y-2">
               {gratitude.length === 0 && journal.length === 0 && cookbook.length === 0 ? (
                  <EmptyState icon={<FileText className="w-6 h-6" />} title="No Activity" description="Family entries will appear here." />
               ) : (
                 <>
                   {cookbook.slice(0, 2).map((m) => (
                    <div key={m.id} className="text-xs border border-sand p-2 rounded-lg bg-sand/30">
                      <span className="font-semibold">Cookbook:</span> {m.cookNames} uploaded a memory.
                    </div>
                   ))}
                   {gratitude.slice(0, 2).map((g) => (
                    <div key={g.id} className="text-xs border border-sand p-2 rounded-lg bg-sand/30">
                      <span className="font-semibold">{students.find((s) => s.id === g.studentId)?.name}:</span> {g.text}
                    </div>
                   ))}
                   {journal.slice(0, 2).map((j) => (
                    <div key={j.id} className="text-xs border border-sand p-2 rounded-lg bg-sand/30">
                      <span className="font-semibold">Journal:</span> {j.title}
                    </div>
                   ))}
                 </>
               )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="wj-card border border-sand p-4 flex flex-col justify-center items-center text-center bg-white shadow-sm">
      <div className="text-3xl font-display font-semibold text-ocean-deep">{value}</div>
      <div className="text-xs uppercase tracking-wider font-semibold text-ink-soft mt-1">{label}</div>
    </div>
  );
}

function EmptyState({ icon, title, description, actionUrl, actionLabel }: { icon: React.ReactNode, title: string, description: string, actionUrl?: string, actionLabel?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-sand-deep/30 rounded-xl border border-sand border-dashed">
      <div className="text-ink-soft mb-2 opacity-50">{icon}</div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="text-xs text-ink-soft mt-1 max-w-[200px]">{description}</p>
      {actionUrl && actionLabel && (
        <Link href={actionUrl} className="wj-btn wj-btn-ghost mt-3 text-xs">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
