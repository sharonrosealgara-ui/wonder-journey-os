"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, RotateCcw, Sparkles, Heart, ShieldAlert, Volume2 } from "lucide-react";
import {
  EditorialContainer,
  JournalSurface,
  WashiTapeStrip,
  FluidMeasure,
} from "@/components/visual";

export default function CelebrationsShowcase() {
  const [recState, setRecState] = useState<"idle" | "recording" | "preview">("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecState("preview");
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setRecState("recording");
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      // In non-interactive or permission-denied environments, stay in idle
      setRecState("idle");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setRecState("idle");
    setSeconds(0);
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!audioPlayerRef.current || !audioUrl) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <EditorialContainer
      id="celebrations"
      as="section"
      sceneWidth="4k"
      className="py-14 sm:py-20 md:py-28 bg-sand/20 border-b border-sand-deep/50 relative overflow-hidden"
    >
      {/* 4K Environmental Atmospheric Accents */}
      <div
        className="absolute top-1/3 -right-32 w-[500px] 2xl:w-[750px] 4k:w-[1000px] h-[500px] 2xl:h-[750px] 4k:h-[1000px] bg-sunset/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -left-32 w-[500px] 2xl:w-[750px] 4k:w-[1000px] h-[500px] 2xl:h-[750px] 4k:h-[1000px] bg-mango/10 rounded-full blur-3xl pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl 2xl:max-w-4xl 4k:max-w-5xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sunset/15 border border-sunset/30 text-sunset-deep text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Celebrations &amp; Learner Memories</span>
        </div>
        <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl 2xl:text-6xl 4k:text-7xl text-ocean-deep font-bold mt-1 leading-tight">
          Learning creates memories, too.
        </h2>
        <FluidMeasure align="center" className="mt-3">
          <p className="text-base sm:text-lg 2xl:text-xl text-ink font-semibold leading-relaxed">
            Wonder Journey celebrations hold birthday wishes, encouragement, learner creations, milestones, and meaningful moments between teacher and family.
          </p>
        </FluidMeasure>
      </div>

      {/* 2-Column Showcase: Handcrafted Keepsakes & Voice Postcard Preview */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 2xl:gap-16 items-start max-w-6xl 2xl:max-w-7xl 4k:max-w-[2000px] mx-auto">

        {/* Left Column: Authentic Student-Created Keepsakes (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <JournalSurface
            variant="pressed-cream"
            shadow="tactile"
            className="p-6 sm:p-8 2xl:p-10 border-2 border-sand-deep/70 relative overflow-hidden"
          >
            <WashiTapeStrip color="mango" position="top-left" />

            <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-sand-deep/40">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-sunset-deep" aria-hidden="true" />
                <span className="font-display text-sm sm:text-base 2xl:text-lg font-bold text-ocean-deep">
                  Authentic Student Keepsakes
                </span>
              </div>
              {/* Privacy Badge */}
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full bg-sand/80 text-ink/75 border border-sand-deep/60 font-mono">
                Documentary Keepsake
              </span>
            </div>

            {/* Keepsake Cards Display */}
            <div className="grid sm:grid-cols-2 gap-5 mt-4">
              {/* Keepsake 1 */}
              <div className="p-4 rounded-2xl bg-paper border border-sand-deep/70 flex flex-col justify-between relative group hover:border-sand-deep transition-all">
                <div className="aspect-[4/3] rounded-xl bg-sand/40 border border-sand-deep/50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-xl mb-2">
                    🎂
                  </div>
                  <p className="font-display text-xs 2xl:text-sm text-ocean-deep font-bold leading-snug">
                    &ldquo;Happy Birthday, Teacher Sharon!&rdquo;
                  </p>
                  <p className="text-[10px] 2xl:text-xs text-ink/70 mt-1 font-mono">
                    Handmade Crayon &amp; Marker Card
                  </p>
                  {/* Consent Gateway Pill */}
                  <div className="mt-3 px-2 py-0.5 rounded-full bg-sand-deep/30 text-[9px] 2xl:text-[10px] font-bold text-ocean-deep tracking-tight">
                    PENDING EXPLICIT GUARDIAN AUTHORIZATION FOR PUBLIC/MARKETING USE
                  </div>
                </div>
                <div className="mt-3 text-left">
                  <p className="text-xs 2xl:text-sm text-ink/80 leading-relaxed font-medium">
                    Handmade birthday greeting created by a Wonder Journey explorer for Teacher Sharon.
                  </p>
                </div>
              </div>

              {/* Keepsake 2 */}
              <div className="p-4 rounded-2xl bg-paper border border-sand-deep/70 flex flex-col justify-between relative group hover:border-sand-deep transition-all">
                <div className="aspect-[4/3] rounded-xl bg-sand/40 border border-sand-deep/50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-xl mb-2">
                    🌟
                  </div>
                  <p className="font-display text-xs 2xl:text-sm text-ocean-deep font-bold leading-snug">
                    &ldquo;You Are The Best Teacher!&rdquo;
                  </p>
                  <p className="text-[10px] 2xl:text-xs text-ink/70 mt-1 font-mono">
                    Milestone Encouragement Art
                  </p>
                  {/* Consent Gateway Pill */}
                  <div className="mt-3 px-2 py-0.5 rounded-full bg-sand-deep/30 text-[9px] 2xl:text-[10px] font-bold text-ocean-deep tracking-tight">
                    PENDING EXPLICIT GUARDIAN AUTHORIZATION FOR PUBLIC/MARKETING USE
                  </div>
                </div>
                <div className="mt-3 text-left">
                  <p className="text-xs 2xl:text-sm text-ink/80 leading-relaxed font-medium">
                    Milestone celebration keepsake — celebrating perseverance, curiosity, and character.
                  </p>
                </div>
              </div>
            </div>

            {/* Dignity & Privacy Safeguard Note */}
            <div className="mt-5 p-3.5 rounded-xl bg-sand/40 border border-sand-deep/50 flex items-start gap-2.5 text-[11px] 2xl:text-xs text-ink/75 leading-relaxed font-medium">
              <ShieldAlert className="w-4 h-4 text-sunset-deep shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                All learner artwork preserves genuine child handwriting and authentic texture while strictly redacting child names, ages, and school identities.
              </span>
            </div>
          </JournalSurface>
        </div>

        {/* Right Column: Audio Postcard Demonstration & Product Truth (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <JournalSurface
            variant="field-notebook"
            hasStitch={true}
            shadow="tactile"
            className="p-6 sm:p-8 2xl:p-9 border-2 border-sand-deep/70"
          >
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-sand-deep/40">
              <Volume2 className="w-4 h-4 text-ocean-deep" aria-hidden="true" />
              <span className="font-display text-sm sm:text-base 2xl:text-lg font-bold text-ocean-deep">
                Learner Voice Postcard
              </span>
            </div>

            {/* Exact Product Truth Wording (Boundary 5) */}
            <p className="text-xs sm:text-sm 2xl:text-base text-ink/85 font-semibold mb-5 leading-relaxed">
              Interactive Product Preview &mdash; audio stays in this browser session and is not sent.
            </p>

            {/* Demonstrated Learner Flow: Record → Stop → Preview → Re-record */}
            <div className="p-5 rounded-2xl bg-white/90 border border-sand-deep/70 text-center shadow-2xs">
              <div className="text-xs 2xl:text-sm font-mono font-bold text-ocean-deep uppercase tracking-wider mb-3">
                {recState === "idle" && "Ready to Test Mic"}
                {recState === "recording" && `Recording: ${seconds}s / 30s`}
                {recState === "preview" && "Audio Recorded (Local Preview)"}
              </div>

              {recState === "idle" && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="wj-btn text-sm px-6 py-2.5 inline-flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Mic className="w-4 h-4" aria-hidden="true" />
                  <span>Record Voice Postcard</span>
                </button>
              )}

              {recState === "recording" && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="wj-btn text-sm px-6 py-2.5 bg-sunset hover:bg-sunset-deep text-white border-none inline-flex items-center gap-2 shadow-xs cursor-pointer animate-pulse"
                >
                  <Square className="w-4 h-4" aria-hidden="true" />
                  <span>Stop Recording</span>
                </button>
              )}

              {recState === "preview" && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlayback}
                    className="wj-btn text-sm px-5 py-2 inline-flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Play className="w-4 h-4" aria-hidden="true" />
                    <span>{isPlaying ? "Pause" : "Preview"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="wj-btn wj-btn-ghost text-sm px-4 py-2 border border-sand-deep inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Re-record</span>
                  </button>
                  <audio
                    ref={audioPlayerRef}
                    src={audioUrl || undefined}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              <div className="mt-4 text-[10px] 2xl:text-xs font-mono text-ink/60 uppercase tracking-widest">
                Flow: Record &rarr; Stop &rarr; Preview &rarr; Re-record
              </div>
              <div className="mt-1 text-[10px] 2xl:text-xs font-mono font-bold text-sunset-deep tracking-wider">
                No Send. No Upload.
              </div>
            </div>

            {/* Static Teacher Blessing Card (Static Preview-Only) */}
            <div className="mt-5 p-4 rounded-2xl bg-sand/30 border border-sand-deep/50 text-left">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-wider text-mango-deep">
                  Teacher Blessing &bull; Static Preview
                </span>
                <span className="text-[9px] 2xl:text-[10px] font-mono font-bold text-ink/60 px-2 py-0.5 rounded-full bg-sand-deep/30">
                  Visual Preview Only
                </span>
              </div>
              <p className="font-display text-xs sm:text-sm 2xl:text-base font-bold text-ocean-deep">
                Teacher Blessing &amp; Encouragement
              </p>

              {/* Decorative Waveform Presentation */}
              <div className="mt-3 p-2.5 rounded-xl bg-white/80 border border-sand-deep/40 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-sand-deep/30 flex items-center justify-center text-ink/40 shrink-0" aria-hidden="true">
                  <Volume2 className="w-3.5 h-3.5 text-ink/50" />
                </div>
                <div className="flex items-center gap-1 h-5 flex-1" aria-hidden="true">
                  <span className="w-1 h-2 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-3.5 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-2 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-4 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-3 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-2 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-3.5 bg-sand-deep/60 rounded-full" />
                  <span className="w-1 h-2 bg-sand-deep/60 rounded-full" />
                </div>
                <span className="text-[10px] 2xl:text-xs font-mono text-ink/60 shrink-0">
                  Visual preview decoration
                </span>
              </div>

              <p className="text-[11px] 2xl:text-xs text-ink/70 mt-2.5 leading-relaxed font-medium">
                Static visual preview only &mdash; no teacher audio asset exists or plays in this preview. Audio is not delivered, sent, or stored.
              </p>
            </div>

          </JournalSurface>
        </div>

      </div>

    </EditorialContainer>
  );
}
