 "use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type Tab = "ask" | "capture" | "explore";

type Memory = {
  id: string;
  text: string;
  type?: string;
  context?: string | null;
  mentioned_at?: string | null;
};

const demoMemory =
  "We chose PostgreSQL instead of MongoDB because our payment system requires reliable ACID transactions. We kept Redis for caching.";

const demoQuery =
  "Why did we choose PostgreSQL instead of MongoDB?";

export default function DevRecallApp() {
  const [activeTab, setActiveTab] = useState<Tab>("ask");

  const [query, setQuery] = useState("");
  const [memory, setMemory] = useState("");
  const [context, setContext] = useState("");

  const [answer, setAnswer] = useState("");
  const [memories, setMemories] = useState<Memory[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exploring, setExploring] = useState(false);

  const [status, setStatus] = useState("");

  function loadDemoScenario() {
    setMemory(demoMemory);
    setContext("Database architecture decision");
    setQuery(demoQuery);
    setAnswer("");
    setStatus(
      "Demo scenario loaded. Store the memory, then ask DevRecall."
    );
    setActiveTab("capture");
  }

  async function askDevRecall() {
    if (!query.trim()) return;

    setLoading(true);
    setAnswer("");
    setStatus("");

    try {
      const response = await fetch(`${API}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Something went wrong."
        );
      }

      setAnswer(data.answer || "No answer returned.");
    } catch (error) {
      setAnswer(
        error instanceof Error
          ? error.message
          : "Unable to connect to DevRecall."
      );
    } finally {
      setLoading(false);
    }
  }

  async function captureMemory() {
    if (!memory.trim()) return;

    setSaving(true);
    setStatus("");

    try {
      const response = await fetch(`${API}/memory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: memory.trim(),
          context: context.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to store memory."
        );
      }

      setStatus("Memory stored successfully.");
      setMemory("");
      setContext("");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to store memory."
      );
    } finally {
      setSaving(false);
    }
  }

  async function exploreMemories() {
    setExploring(true);
    setStatus("");

    try {
      const response = await fetch(`${API}/memories`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to load memories."
        );
      }

      setMemories(data.memories || []);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Unable to load project memory."
      );
    } finally {
      setExploring(false);
    }
  }

  function changeTab(tab: Tab) {
    setActiveTab(tab);
    setStatus("");

    if (tab === "explore") {
      exploreMemories();
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />

        <div className="absolute right-[-200px] top-[35%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />

        <div className="absolute bottom-[-200px] left-[-150px] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[150px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <a
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
              <span className="text-sm font-bold">
                D
              </span>
            </div>

            <div>
              <div className="text-sm font-semibold">
                DevRecall
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-600">
                Project memory
              </div>
            </div>
          </a>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/10 bg-emerald-500/5 px-3 py-1.5 text-[11px] text-emerald-400 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Hindsight connected
            </div>

            <button
              onClick={loadDemoScenario}
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/[0.09] hover:text-white"
            >
              Demo Mode
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
        {/* Intro */}
        <div className="mb-10">
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-500"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            Long-term AI memory
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.05,
            }}
            className="text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Your project remembers.
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="mt-4 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base"
          >
            Ask questions, capture engineering decisions, and
            explore the project knowledge DevRecall has retained.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            {
              id: "ask" as Tab,
              label: "Ask",
              icon: "✦",
            },
            {
              id: "capture" as Tab,
              label: "Capture Memory",
              icon: "＋",
            },
            {
              id: "explore" as Tab,
              label: "Explore",
              icon: "⌕",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => changeTab(tab.id)}
              className={`rounded-full border px-4 py-2.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? "border-white/15 bg-white text-black"
                  : "border-white/10 bg-white/[0.03] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
              }`}
            >
              <span className="mr-2">
                {tab.icon}
              </span>

              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {/* ASK */}
          {activeTab === "ask" && (
            <motion.section
              key="ask"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="grid gap-6 lg:grid-cols-[1fr_360px]"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-7">
                <div className="mb-6">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Ask DevRecall
                  </div>

                  <h2 className="mt-2 text-xl font-medium">
                    What should your AI remember?
                  </h2>
                </div>

                <textarea
                  value={query}
                  onChange={(event) =>
                    setQuery(event.target.value)
                  }
                  placeholder="Why did we choose PostgreSQL instead of MongoDB?"
                  className="min-h-[150px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-zinc-700">
                    DevRecall will synthesize relevant project
                    memories.
                  </p>

                  <button
                    onClick={askDevRecall}
                    disabled={loading || !query.trim()}
                    className="rounded-xl bg-white px-5 py-3 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {loading
                      ? "Thinking..."
                      : "Ask DevRecall →"}
                  </button>
                </div>

                {answer && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6"
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-xs font-bold text-black">
                        D
                      </div>

                      <div>
                        <div className="text-sm font-medium">
                          DevRecall
                        </div>

                        <div className="text-[10px] uppercase tracking-widest text-zinc-700">
                          Memory synthesis
                        </div>
                      </div>
                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-8 text-zinc-300">
                      {answer}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-zinc-600">
                        Hindsight
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-zinc-600">
                        Reflect
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-zinc-600">
                        Project context
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right panel */}
              <div className="space-y-4">
                <MemoryEngineCard
                  number="01"
                  title="Retain"
                  description="Store project decisions and engineering context."
                />

                <MemoryEngineCard
                  number="02"
                  title="Recall"
                  description="Retrieve memories relevant to your question."
                />

                <MemoryEngineCard
                  number="03"
                  title="Reflect"
                  description="Synthesize multiple memories into an answer."
                />
              </div>
            </motion.section>
          )}

          {/* CAPTURE */}
          {activeTab === "capture" && (
            <motion.section
              key="capture"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mx-auto max-w-4xl"
            >
              <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5 sm:p-8">
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Capture memory
                  </div>

                  <h2 className="mt-2 text-2xl font-medium">
                    Give your project a memory.
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-500">
                    Store an architectural decision, debugging
                    discovery, engineering preference, or any
                    context that your AI should remember later.
                  </p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Memory
                    </label>

                    <textarea
                      value={memory}
                      onChange={(event) =>
                        setMemory(event.target.value)
                      }
                      placeholder="Example: We chose PostgreSQL instead of MongoDB because our payment system requires reliable ACID transactions."
                      className="min-h-[180px] w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs text-zinc-500">
                      Context
                    </label>

                    <input
                      value={context}
                      onChange={(event) =>
                        setContext(event.target.value)
                      }
                      placeholder="Example: Database architecture decision"
                      className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-white/20"
                    />
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[11px] text-zinc-700">
                      Stored using Hindsight long-term memory.
                    </div>

                    <button
                      onClick={captureMemory}
                      disabled={
                        saving || !memory.trim()
                      }
                      className="rounded-xl bg-white px-6 py-3 text-xs font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {saving
                        ? "Remembering..."
                        : "Remember this →"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Demo hint */}
              <div className="mt-5 rounded-2xl border border-white/5 bg-white/[0.015] p-5">
                <div className="text-xs font-medium text-zinc-400">
                  💡 Try Demo Mode
                </div>

                <p className="mt-2 text-xs leading-6 text-zinc-600">
                  Click Demo Mode in the navbar to load a
                  ready-made architecture decision. Store it,
                  then switch to Ask and ask why PostgreSQL was
                  chosen.
                </p>
              </div>
            </motion.section>
          )}

          {/* EXPLORE */}
          {activeTab === "explore" && (
            <motion.section
              key="explore"
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                    Project memory
                  </div>

                  <h2 className="mt-2 text-2xl font-medium">
                    What DevRecall knows.
                  </h2>

                  <p className="mt-2 text-sm text-zinc-600">
                    Explore memories retained for this project.
                  </p>
                </div>

                <button
                  onClick={exploreMemories}
                  disabled={exploring}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs text-zinc-300 transition hover:bg-white/[0.08] disabled:opacity-40"
                >
                  {exploring
                    ? "Refreshing..."
                    : "Refresh memories"}
                </button>
              </div>

              {memories.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-20 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg">
                    ◌
                  </div>

                  <h3 className="mt-5 text-sm font-medium text-zinc-300">
                    No memories loaded yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-zinc-700">
                    Capture your first project memory or refresh
                    this view to retrieve memories from Hindsight.
                  </p>

                  <button
                    onClick={exploreMemories}
                    className="mt-5 rounded-xl bg-white px-5 py-3 text-xs font-semibold text-black"
                  >
                    Load project memory
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {memories.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{
                        opacity: 0,
                        y: 15,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
                    >
                      <div className="mb-5 flex items-center justify-between gap-4">
                        <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-zinc-600">
                          {item.type || "memory"}
                        </span>

                        {item.mentioned_at && (
                          <span className="text-[10px] text-zinc-700">
                            {formatDate(
                              item.mentioned_at
                            )}
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-7 text-zinc-300">
                        {item.text}
                      </p>

                      {item.context && (
                        <div className="mt-5 border-t border-white/5 pt-4">
                          <div className="text-[10px] uppercase tracking-widest text-zinc-700">
                            Context
                          </div>

                          <div className="mt-2 text-xs text-zinc-500">
                            {item.context}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {/* Status */}
        <AnimatePresence>
          {status && (
            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="mt-6 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs text-zinc-500"
            >
              <span className="mr-2 text-emerald-400">
                ●
              </span>

              {status}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-20 border-t border-white/5 pt-8">
          <div className="flex flex-col justify-between gap-3 text-[11px] text-zinc-700 sm:flex-row">
            <span>
              DevRecall · Long-term memory for AI coding
              assistants
            </span>

            <span>
              Powered by Hindsight
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}

function MemoryEngineCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:bg-white/[0.04]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-700">
          {number}
        </span>

        <span className="text-zinc-700">
          ↗
        </span>
      </div>

      <h3 className="mt-8 text-sm font-medium">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-zinc-600">
        {description}
      </p>
    </div>
  );
}

function formatDate(date: string) {
  try {
    return new Date(date).toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  } catch {
    return date;
  }
}