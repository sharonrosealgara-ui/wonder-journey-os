"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getStudent, students } from "@/config/family";
import type { Mode } from "@/config/navigation";
import { formatDate, KEYS, todayISO, type GratitudeEntry, type JournalEntry } from "@/lib/app-state";
import { newId, useStored } from "@/lib/storage";

const flowers = ["🌸", "🌻", "🌺", "🌼", "🌷", "🪻", "🌹", "💐"];

type Tab = "garden" | "wall" | "journal";

export default function JournalPage() {
  const [tab, setTab] = useState<Tab>("garden");
  const [mode] = useStored<Mode>(KEYS.mode, "family");
  const [activeStudentId] = useStored<string | null>(KEYS.activeStudent, null);
  const [gratitude] = useStored<GratitudeEntry[]>(KEYS.gratitude, []);
  const [journal, setJournal] = useStored<JournalEntry[]>(KEYS.journal, []);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const student = getStudent(activeStudentId);
  const isTeacher = mode === "teacher";

  // The Family Portal is shared — the whole family sees the whole garden,
  // wall, and journal together (Decision 040: no per-student logins).
  const visibleGratitude = gratitude;
  const visibleJournal = journal;

  function addJournal() {
    if (!student || !text.trim()) return;
    setJournal((prev) => [
      { id: newId(), studentId: student.id, date: todayISO(), title: title.trim() || "My journal entry", text: text.trim() },
      ...prev,
    ]);
    setTitle("");
    setText("");
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="relative z-10 mb-8 bg-gradient-to-br from-palm/10 to-ocean/5 p-8 rounded-3xl border border-white shadow-sm overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[-1]"
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 Q 25 25 50 50 T 100 50' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 70 Q 25 45 50 70 T 100 70' stroke='%23004060' fill='none' stroke-width='2'/%3E%3Cpath d='M0 30 Q 25 5 50 30 T 100 30' stroke='%23004060' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
               backgroundSize: "200px 200px"
             }}
        />
        <PageHeader
          emoji="📔"
          title="Gratitude Journal"
          subtitle="Every blessing you write plants a flower in the family garden."
        />
      </div>

      <div className="flex flex-wrap gap-3 sticky top-4 z-20 bg-white/80 backdrop-blur-md p-2 rounded-full border border-sand/50 shadow-sm w-fit mx-auto">
        <TabButton active={tab === "garden"} onClick={() => setTab("garden")}>🌸 Gratitude Garden</TabButton>
        <TabButton active={tab === "wall"} onClick={() => setTab("wall")}>🧱 Family Blessings Wall</TabButton>
        <TabButton active={tab === "journal"} onClick={() => setTab("journal")}>✏️ My Journal</TabButton>
      </div>

      {tab === "garden" && (
        <section className="wj-card p-0 overflow-hidden border-2 border-white/60 shadow-lg relative bg-sky/10 backdrop-blur-sm group mt-6">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-mango/10 blur-[100px] rounded-full z-0 opacity-80"></div>
          
          <div className="p-8 sm:p-10 relative z-10 text-center">
            <h2 className="font-display text-3xl font-extrabold text-palm-deep drop-shadow-sm flex items-center justify-center gap-2">
              <span className="text-4xl">🌸</span> The Family Gratitude Garden
            </h2>
            <p className="mt-4 text-lg font-medium text-ocean-deep/80 max-w-lg mx-auto bg-white/50 px-6 py-3 rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm">
              {visibleGratitude.length === 0
                ? "The garden is waiting for its first flower — write a Morning Blessing to plant one!"
                : `${visibleGratitude.length} flower${visibleGratitude.length === 1 ? "" : "s"} of gratitude have bloomed 🌱`}
            </p>
          </div>
          
          <div className="relative h-64 sm:h-80 w-full mt-4 flex items-end justify-center px-8 pb-12 overflow-hidden">
            {/* Garden depth layers */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-palm/30 to-transparent z-0"></div>
            <div className="absolute -bottom-10 left-0 w-full h-24 bg-palm/40 blur-xl z-0 rounded-t-full opacity-60"></div>
            
            <div className="relative z-10 flex flex-wrap justify-center items-end gap-2 sm:gap-4 px-10 w-full">
              {visibleGratitude.map((g, i) => {
                const s = getStudent(g.studentId);
                return (
                  <div key={g.id} className="relative group/flower cursor-help flex flex-col items-center justify-end h-32" title={`${s?.name ?? "Family"}: ${g.text}`}>
                    {/* STEM */}
                    <div className="w-1.5 h-12 bg-gradient-to-b from-palm/60 to-palm-deep/80 rounded-full mb-[-10px] z-0 transform origin-bottom transition-all duration-[2s] group-hover/flower:h-16"></div>
                    {/* FLOWER */}
                    <span className="text-5xl sm:text-6xl drop-shadow-md transition-all duration-500 ease-out transform group-hover/flower:scale-125 group-hover/flower:-translate-y-2 group-hover/flower:rotate-12 z-10 relative">
                      {flowers[i % flowers.length]}
                      
                      {/* TOOLTIP ON HOVER */}
                      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover/flower:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-sand/50 text-center">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft/80 mb-1">{s?.name ?? "Family"}</p>
                          <p className="text-sm font-medium text-ink leading-tight line-clamp-3">{g.text}</p>
                        </div>
                        <div className="w-3 h-3 bg-white/95 border-b border-r border-sand/50 transform rotate-45 mx-auto -mt-1.5"></div>
                      </div>
                    </span>
                  </div>
                );
              })}
              {visibleGratitude.length === 0 && <span className="text-6xl drop-shadow-md z-10 opacity-70">🌱</span>}
            </div>
          </div>
        </section>
      )}

      {tab === "wall" && (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {gratitude.length === 0 && (
            <div className="wj-card p-10 text-center col-span-full border-2 border-dashed border-sand bg-sand/20 flex flex-col items-center justify-center">
              <span className="text-5xl mb-4 opacity-50 grayscale drop-shadow-sm">🧱</span>
              <p className="font-display text-xl font-bold text-ocean-deep mb-2">The Wall is waiting</p>
              <p className="font-medium text-ink-soft">The Blessings Wall fills up as the family writes Morning Blessings. 💛</p>
            </div>
          )}
          {gratitude.map((g) => {
            const s = getStudent(g.studentId);
            return (
              <div key={g.id} className="wj-card p-0 overflow-hidden border-2 border-white/60 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm flex flex-col group">
                <div className="p-4 border-b border-sand/50 bg-gradient-to-r from-sand/20 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm border border-white text-xl"
                      style={{ background: `linear-gradient(135deg, ${s?.color ?? "#ccc"}33, ${s?.color ?? "#ccc"}66)` }}
                    >
                      {s?.emoji ?? "💛"}
                    </span>
                    <span className="font-display text-lg font-extrabold text-ocean-deep">{s?.name ?? "Family"}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-ink-soft bg-white/80 px-2 py-1 rounded-full shadow-inner">{formatDate(g.date)}</span>
                </div>
                <div className="p-6 flex-1 flex flex-col relative">
                  {/* Subtle quote mark */}
                  <span className="absolute top-4 left-4 text-6xl text-sand-deep/20 font-serif leading-none pointer-events-none z-0">"</span>
                  
                  <p className="text-sm font-medium italic text-ink-soft/80 mb-3 relative z-10">{g.prompt}</p>
                  <p className="text-lg font-hand text-ink leading-relaxed relative z-10 flex-1">{g.text}</p>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {tab === "journal" && (
        <section className="space-y-8 mt-6 max-w-4xl mx-auto">
          {student && !isTeacher && (
            <div className="wj-card p-8 border-2 border-white/60 shadow-lg bg-gradient-to-br from-white to-sand/10 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 L20 10 M10 0 L10 20' stroke='%23004060' fill='none' stroke-width='0.5' stroke-dasharray='1,3'/%3E%3C/svg%3E")`, backgroundSize: "20px 20px" }} />
              
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl drop-shadow-sm">✏️</span>
                <h2 className="font-display text-2xl font-extrabold text-ocean-deep">Write a new entry</h2>
              </div>
              
              <div className="space-y-5 relative z-10">
                <div>
                  <label className="text-xs font-bold text-ocean-deep uppercase tracking-widest mb-1.5 block">Title</label>
                  <input
                    className="wj-input shadow-inner border-sand focus:border-mango transition-colors text-lg font-medium w-full"
                    placeholder="My favorite part of today..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-ocean-deep uppercase tracking-widest mb-1.5 block">Memory</label>
                  <textarea
                    className="wj-input shadow-inner border-sand focus:border-mango transition-colors min-h-32 text-lg font-hand w-full leading-relaxed resize-y"
                    placeholder="What do you want to remember about today?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <button className="wj-btn wj-btn-ocean text-lg px-8 py-3 w-full sm:w-auto shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2" onClick={addJournal} disabled={!text.trim()}>
                  Save entry 💾
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <h3 className="font-display text-xl font-bold text-ink/70 flex items-center gap-4">
              <span>Past Entries</span>
              <div className="flex-1 h-px bg-sand-deep/40"></div>
            </h3>
            
            {visibleJournal.length === 0 && (
              <div className="wj-card p-10 text-center border border-dashed border-sand bg-sand/10 text-ink-soft font-medium">No journal entries yet.</div>
            )}
            
            {visibleJournal.map((j) => {
              const s = getStudent(j.studentId);
              return (
                <div key={j.id} className="wj-card p-0 border border-sand-deep/30 shadow-md bg-white hover:shadow-lg transition-shadow relative overflow-hidden group">
                  {/* Journal paper lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, #004060 31px, #004060 32px)`, backgroundPosition: "0 -1px" }}></div>
                  {/* Red margin line */}
                  <div className="absolute top-0 bottom-0 left-16 w-px bg-hibiscus/30 pointer-events-none"></div>
                  
                  <div className="relative z-10 p-6 pl-24">
                    <div className="absolute top-6 left-5 text-2xl drop-shadow-sm">{s?.emoji}</div>
                    
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h3 className="font-display text-2xl font-extrabold text-ocean-deep">{j.title}</h3>
                      <span className="text-xs font-bold uppercase tracking-widest text-ink-soft/70 bg-sand/30 px-2 py-1 rounded-md">{formatDate(j.date)}</span>
                    </div>
                    
                    <p className="text-lg font-hand text-ink leading-[32px] whitespace-pre-wrap">{j.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-6 py-3 font-display text-sm font-extrabold tracking-wide transition-all duration-300 ${
        active ? "bg-ocean text-white shadow-md scale-105" : "bg-transparent text-ink-soft hover:bg-sand/50 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
