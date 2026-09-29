"use client";

import {
  Activity,
  BarChart3,
  Brain,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Code2,
  Database,
  GitBranch,
  History,
  Lightbulb,
  Network,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* =========================================================
   CONFIG
========================================================= */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

/* =========================================================
   TYPES
========================================================= */

type Tab =
  | "ask"
  | "capture"
  | "explorer"
  | "timeline"
  | "graph"
  | "summary"
  | "why";

type Stats = {
  bank_id?: string;
  total_nodes?: number;
  total_links?: number;
  total_documents?: number;

  nodes_by_fact_type?: Record<string, number>;
  links_by_link_type?: Record<string, number>;

  pending_operations?: number;
  failed_operations?: number;

  operations_by_status?: Record<string, number>;

  last_consolidated_at?: string;
  last_memory_write_at?: string;

  pending_consolidation?: number;
  failed_consolidation?: number;

  total_observations?: number;
};

type Memory = {
  id: string;
  text: string;
  type?: string;
  context?: string;
  mentioned_at?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  answer?: string;
  query?: string;
  detail?: string;

  result?: unknown;

  results?: {
    results?: Memory[];
    [key: string]: unknown;
  };

  memories?: Memory[];
  stats?: Stats;
};

/* =========================================================
   NAVIGATION
========================================================= */

const navigation: {
  id: Tab;
  label: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    id: "ask",
    label: "Memory Core",
    description: "Ask your project memory",
    icon: <Sparkles size={18} />,
  },
  {
    id: "capture",
    label: "Capture",
    description: "Store project knowledge",
    icon: <Plus size={18} />,
  },
  {
    id: "explorer",
    label: "Memory Explorer",
    description: "Browse remembered knowledge",
    icon: <Search size={18} />,
  },
  {
    id: "timeline",
    label: "Timeline",
    description: "See project evolution",
    icon: <Clock3 size={18} />,
  },
  {
    id: "graph",
    label: "Memory Graph",
    description: "Explore memory relationships",
    icon: <Network size={18} />,
  },
  {
    id: "summary",
    label: "Intelligence",
    description: "Memory analytics",
    icon: <BarChart3 size={18} />,
  },
  {
    id: "why",
    label: "Why DevRecall?",
    description: "Understand the memory layer",
    icon: <CircleHelp size={18} />,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value?: number) {
  return new Intl.NumberFormat().format(value ?? 0);
}

function formatDate(value?: string) {
  if (!value) return "—";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activeTab,
  setActiveTab,
  backendOnline,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  backendOnline: boolean;
}) {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 hidden w-[270px] flex-col border-r border-white/[0.07] bg-[#05060a]/95 backdrop-blur-2xl lg:flex">
      {/* BRAND */}

      <div className="flex items-center gap-3 px-6 py-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,.12)]">
          <Brain size={22} className="text-violet-300" />

          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
        </div>

        <div>
          <div className="text-sm font-semibold tracking-tight text-white">
            DevRecall
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            Project Memory
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <div className="px-3">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25">
          Workspace
        </div>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all ${
                  active
                    ? "bg-white/[0.08] text-white"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white/80"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute bottom-2 left-0 top-2 w-[2px] rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,.9)]"
                  />
                )}

                <span
                  className={
                    active
                      ? "text-violet-300"
                      : "text-white/35 group-hover:text-white/70"
                  }
                >
                  {item.icon}
                </span>

                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {item.label}
                  </div>

                  <div className="mt-0.5 truncate text-[10px] text-white/25">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* SYSTEM */}

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Hindsight
            </span>

            <span
              className={`flex items-center gap-1.5 text-[10px] ${
                backendOnline ? "text-emerald-400" : "text-red-400"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  backendOnline
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]"
                    : "bg-red-400"
                }`}
              />

              {backendOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          <div className="text-xs text-white/50">
            Long-term memory engine
          </div>

          <div className="mt-3 flex items-center gap-2 text-[10px] text-white/25">
            <Database size={12} />
            <span>devrecall bank</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* =========================================================
   MOBILE NAV
========================================================= */

function MobileNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.08] bg-[#05060a]/95 p-2 backdrop-blur-xl lg:hidden">
      <div className="flex gap-1 overflow-x-auto">
        {navigation.map((item) => {
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex min-w-[78px] flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[9px] ${
                active
                  ? "bg-white/[0.08] text-white"
                  : "text-white/35"
              }`}
            >
              <span className={active ? "text-violet-300" : ""}>
                {item.icon}
              </span>

              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   HERO / MEMORY CORE
========================================================= */

function Hero({
  nodeCount,
  linkCount,
  documentCount,
  demoRunning,
  demoStep,
  runDemo,
}: {
  nodeCount: number;
  linkCount: number;
  documentCount: number;
  demoRunning: boolean;
  demoStep: number;
  runDemo: () => void;
}) {
  const active = demoRunning || demoStep >= 0;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#080912] px-6 py-10 md:px-10">
      {/* AMBIENT GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[90px]" />

      {/* STARS */}

      {Array.from({ length: 32 }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute h-1 w-1 rounded-full bg-white/30"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 61) % 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [0.7, 1.2, 0.7],
          }}
          transition={{
            duration: 2 + (index % 4),
            repeat: Infinity,
            delay: index * 0.08,
          }}
        />
      ))}

      <div className="relative z-10 text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-violet-300">
          <Sparkles size={12} />
          Persistent engineering memory
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Your codebase has a{" "}
          <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
            memory.
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
          DevRecall remembers the decisions, debugging experiences,
          architecture choices, and engineering context behind your project.
        </p>

        {/* BRAIN */}

        <div className="relative mx-auto mt-8 flex h-[330px] w-[330px] items-center justify-center md:h-[390px] md:w-[390px]">
          <motion.div
            className="absolute inset-5 rounded-full border border-violet-400/10"
            animate={{ rotate: 360 }}
            transition={{
              duration: active ? 8 : 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute inset-14 rounded-full border border-cyan-400/10"
            animate={{ rotate: -360 }}
            transition={{
              duration: active ? 6 : 18,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          <motion.div
            className="absolute inset-24 rounded-full border border-fuchsia-400/10"
            animate={{ rotate: 360 }}
            transition={{
              duration: active ? 5 : 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* CORE GLOW */}

          <motion.div
            className="absolute rounded-full bg-violet-500/20 blur-[70px]"
            animate={{
              width: active ? [220, 290, 220] : [190, 230, 190],
              height: active ? [220, 290, 220] : [190, 230, 190],
              opacity: active ? [0.45, 0.9, 0.45] : [0.35, 0.7, 0.35],
            }}
            transition={{
              duration: active ? 1.2 : 3,
              repeat: Infinity,
            }}
          />

          {/* BRAIN */}

          <motion.div
            animate={{
              y: [-4, 4, -4],
              scale: active ? [1, 1.08, 1] : [1, 1.025, 1],
              rotate: active ? [-1, 1, -1] : 0,
            }}
            transition={{
              duration: active ? 1.2 : 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-32 w-32 items-center justify-center rounded-[38%] border border-violet-300/30 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/10 shadow-[0_0_80px_rgba(139,92,246,.28)] md:h-40 md:w-40"
          >
            <Brain
              size={96}
              strokeWidth={1}
              className="text-violet-200 md:h-[112px] md:w-[112px]"
            />

            <div className="absolute inset-0 rounded-[38%] bg-violet-400/5 blur-xl" />
          </motion.div>

          {/* ACTIVITY LABELS */}

          <ActivityBadge
            label="RECALL"
            color="cyan"
            position="left"
            active={demoStep === 1}
          />

          <ActivityBadge
            label="RETAIN"
            color="amber"
            position="right"
            active={demoStep === 0}
          />

          <ActivityBadge
            label="REFLECT"
            color="violet"
            position="bottom"
            active={demoStep === 2}
          />
        </div>

        {/* LIVE NUMBERS */}

        <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-3">
          <MiniStat label="MEMORIES" value={nodeCount} />
          <MiniStat label="CONNECTIONS" value={linkCount} />
          <MiniStat label="DOCUMENTS" value={documentCount} />
        </div>

        {/* DEMO */}

        <div className="mt-8">
          <button
            onClick={runDemo}
            disabled={demoRunning}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-[0_0_35px_rgba(255,255,255,.08)] transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {demoRunning ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Running Memory Demo...
              </>
            ) : (
              <>
                <Zap size={16} />
                Run Memory Demo
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

function ActivityBadge({
  label,
  color,
  position,
  active,
}: {
  label: string;
  color: "cyan" | "amber" | "violet";
  position: "left" | "right" | "bottom";
  active: boolean;
}) {
  const colors = {
    cyan: "text-cyan-300 border-cyan-400/20 bg-cyan-400/[0.05]",
    amber: "text-amber-300 border-amber-400/20 bg-amber-400/[0.05]",
    violet: "text-violet-300 border-violet-400/20 bg-violet-400/[0.05]",
  };

  const positions = {
    left: "left-0 top-24",
    right: "right-0 top-16",
    bottom: "bottom-10 left-8",
  };

  return (
    <motion.div
      className={`absolute ${positions[position]} rounded-xl border px-3 py-2 backdrop-blur-md ${colors[color]}`}
      animate={{
        y: active ? [0, -7, 0] : [-4, 4, -4],
        scale: active ? [1, 1.08, 1] : 1,
      }}
      transition={{
        duration: active ? 0.7 : 4,
        repeat: Infinity,
      }}
    >
      <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.12em]">
        {label === "RETAIN" && <Database size={12} />}
        {label === "RECALL" && <Search size={12} />}
        {label === "REFLECT" && <Brain size={12} />}
        {label}
      </div>
    </motion.div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3">
      <div className="text-lg font-semibold text-white">
        {formatNumber(value)}
      </div>

      <div className="text-[9px] tracking-[0.18em] text-white/25">
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   LIVE STATS
========================================================= */

function LiveStats({
  stats,
  loading,
}: {
  stats: Stats | null;
  loading: boolean;
}) {
  const cards = [
    {
      label: "Memory Nodes",
      value: stats?.total_nodes ?? 0,
      icon: <Database size={17} />,
      className: "text-amber-300",
    },
    {
      label: "Connections",
      value: stats?.total_links ?? 0,
      icon: <Network size={17} />,
      className: "text-fuchsia-300",
    },
    {
      label: "Documents",
      value: stats?.total_documents ?? 0,
      icon: <Code2 size={17} />,
      className: "text-cyan-300",
    },
    {
      label: "Observations",
      value: stats?.total_observations ?? 0,
      icon: <Lightbulb size={17} />,
      className: "text-emerald-300",
    },
  ];

  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">
            Live Memory State
          </div>

          <div className="text-xs text-white/30">
            Real-time Hindsight bank statistics
          </div>
        </div>

        {loading && (
          <RefreshCw
            size={14}
            className="animate-spin text-white/30"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
          >
            <div className={`mb-4 ${card.className}`}>
              {card.icon}
            </div>

            <div className="text-2xl font-semibold text-white">
              {formatNumber(card.value)}
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-white/25">
              {card.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   PIPELINE
========================================================= */

function Pipeline({
  activeStep,
}: {
  activeStep: number;
}) {
  const steps = [
    {
      title: "Retain",
      description: "Store project knowledge",
      icon: <Database size={17} />,
      color: "amber",
    },
    {
      title: "Recall",
      description: "Find relevant context",
      icon: <Search size={17} />,
      color: "blue",
    },
    {
      title: "Reflect",
      description: "Generate an informed answer",
      icon: <Brain size={17} />,
      color: "cyan",
    },
  ];

  return (
    <section className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="mb-5">
        <div className="text-sm font-semibold text-white">
          Memory Pipeline
        </div>

        <div className="text-xs text-white/30">
          Retain → Recall → Reflect
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => {
          const active = activeStep === index;
          const completed = activeStep > index;

          return (
            <motion.div
              key={step.title}
              animate={{
                scale: active ? 1.02 : 1,
              }}
              className={`relative rounded-xl border p-4 transition-all ${
                active
                  ? "border-violet-400/30 bg-violet-400/[0.06]"
                  : completed
                    ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                    : "border-white/[0.06] bg-black/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? "bg-violet-400/10 text-violet-300"
                      : completed
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-white/[0.04] text-white/30"
                  }`}
                >
                  {completed ? <Check size={17} /> : step.icon}
                </div>

                <div>
                  <div className="text-sm font-medium text-white">
                    {step.title}
                  </div>

                  <div className="text-[10px] text-white/30">
                    {step.description}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================================================
   WORKSPACE HEADER
========================================================= */

function WorkspaceHeader({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-center gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-violet-300">
        {icon}
      </div>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-white/35">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ASK
========================================================= */

function AskSection() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [evidence, setEvidence] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEvidence, setShowEvidence] = useState(true);
  const [error, setError] = useState("");

  const ask = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setEvidence([]);
    setError("");

    try {
      /* ---------------------------------------------
         1. Recall evidence
      --------------------------------------------- */

      const recallResponse = await fetch(`${API_URL}/recall`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      const recallData: ApiResponse =
        await recallResponse.json();

      if (recallResponse.ok) {
        const recalled =
          recallData.results?.results ?? [];

        setEvidence(recalled.slice(0, 5));
      }

      /* ---------------------------------------------
         2. Reflect / answer
      --------------------------------------------- */

      const answerResponse = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      const answerData: ApiResponse =
        await answerResponse.json();

      if (!answerResponse.ok) {
        throw new Error(
          answerData.detail ?? "Failed to generate answer.",
        );
      }

      setAnswer(
        answerData.answer ?? "No answer returned.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    "Why did we choose PostgreSQL instead of MongoDB?",
    "What architecture decisions have we made?",
    "What problems did we encounter during deployment?",
    "What does this project remember about Redis?",
  ];

  return (
    <section>
      <WorkspaceHeader
        title="Ask DevRecall"
        description="Ask questions about the reasoning behind your project."
        icon={<Sparkles size={22} />}
      />

      <div className="rounded-3xl border border-white/[0.08] bg-[#080912] p-5 md:p-7">
        {/* INPUT */}

        <div className="relative">
          <textarea
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                ask();
              }
            }}
            placeholder="Ask why something was built, changed, fixed, or chosen..."
            className="min-h-[150px] w-full resize-none rounded-2xl border border-white/[0.07] bg-black/20 p-5 pr-16 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-violet-400/30"
          />

          <button
            onClick={ask}
            disabled={!query.trim() || loading}
            className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>

        {/* EXAMPLES */}

        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              onClick={() => setQuery(example)}
              className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-xs text-white/40 transition hover:border-violet-400/20 hover:text-white/70"
            >
              {example}
            </button>
          ))}
        </div>

        {/* LOADING */}

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] px-5 py-4"
            >
              <div className="relative flex h-8 w-8 items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-400/30"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <Brain
                  size={15}
                  className="text-cyan-300"
                />
              </div>

              <div>
                <div className="text-xs font-medium text-cyan-300">
                  DevRecall is thinking...
                </div>

                <div className="text-[10px] text-white/25">
                  Searching project memory and reflecting on context
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-400/15 bg-red-400/[0.04] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ANSWER */}

        <AnimatePresence>
          {answer && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 overflow-hidden rounded-2xl border border-violet-400/15 bg-violet-400/[0.035]"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10">
                    <Brain
                      size={15}
                      className="text-violet-300"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-white">
                      DevRecall
                    </div>

                    <div className="text-[10px] text-white/25">
                      Memory-informed response
                    </div>
                  </div>
                </div>

                <div className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.05] px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-emerald-300">
                  Memory Used
                </div>
              </div>

              <div className="p-5">
                <div className="whitespace-pre-wrap text-sm leading-7 text-white/70">
                  {answer}
                </div>
              </div>

              {/* EVIDENCE */}

              {evidence.length > 0 && (
                <div className="border-t border-white/[0.06]">
                  <button
                    onClick={() =>
                      setShowEvidence((value) => !value)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Search
                        size={14}
                        className="text-cyan-300"
                      />

                      <span className="text-xs font-semibold text-white/60">
                        Memory Evidence
                      </span>

                      <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-white/30">
                        {evidence.length}
                      </span>
                    </div>

                    <ChevronRight
                      size={15}
                      className={`text-white/25 transition-transform ${
                        showEvidence ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showEvidence && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 px-5 pb-5">
                          {evidence.map((memory, index) => (
                            <div
                              key={memory.id || index}
                              className="rounded-xl border border-white/[0.06] bg-black/20 p-3"
                            >
                              <div className="flex gap-3">
                                <div className="mt-0.5 text-[10px] text-cyan-300">
                                  {String(index + 1).padStart(
                                    2,
                                    "0",
                                  )}
                                </div>

                                <div className="text-xs leading-6 text-white/40">
                                  {memory.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* =========================================================
   CAPTURE
========================================================= */

function CaptureSection({
  onStored,
}: {
  onStored: () => Promise<void> | void;
}) {
  const [content, setContent] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const save = async () => {
    if (!content.trim() || loading) return;

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}/memory`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          context: context || null,
        }),
      });

      const data: ApiResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ?? "Failed to store memory.",
        );
      }

      setSuccess(true);
      setMessage("Memory successfully retained by Hindsight.");

      setContent("");
      setContext("");

      await onStored();
    } catch (error) {
      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to store memory.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <WorkspaceHeader
        title="Capture Memory"
        description="Give DevRecall knowledge that should survive across conversations."
        icon={<Plus size={22} />}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        {/* FORM */}

        <div className="rounded-3xl border border-white/[0.08] bg-[#080912] p-5 md:p-7">
          <label className="mb-2 block text-xs font-medium text-white/50">
            Memory
          </label>

          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            placeholder="Example: We chose PostgreSQL because the payment system requires reliable ACID transactions."
            className="min-h-[190px] w-full resize-none rounded-2xl border border-white/[0.07] bg-black/20 p-5 text-sm leading-7 text-white outline-none placeholder:text-white/20 focus:border-amber-400/30"
          />

          <label className="mb-2 mt-5 block text-xs font-medium text-white/50">
            Context{" "}
            <span className="text-white/20">
              (optional)
            </span>
          </label>

          <input
            value={context}
            onChange={(event) =>
              setContext(event.target.value)
            }
            placeholder="Architecture, database, deployment, debugging..."
            className="w-full rounded-2xl border border-white/[0.07] bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-amber-400/30"
          />

          <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="text-xs text-white/25">
              Hindsight will connect this memory with
              existing project knowledge.
            </div>

            <button
              onClick={save}
              disabled={!content.trim() || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/90 disabled:opacity-30"
            >
              {loading ? (
                <RefreshCw
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Database size={16} />
              )}

              {loading ? "Retaining..." : "Save Memory"}
            </button>
          </div>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-5 rounded-xl border px-4 py-3 text-sm ${
                success
                  ? "border-emerald-400/15 bg-emerald-400/[0.04] text-emerald-300"
                  : "border-red-400/15 bg-red-400/[0.04] text-red-300"
              }`}
            >
              {success && (
                <Check
                  size={14}
                  className="mr-2 inline"
                />
              )}

              {message}
            </motion.div>
          )}
        </div>

        {/* RETAIN EXPLAINER */}

        <div className="rounded-3xl border border-amber-400/10 bg-amber-400/[0.025] p-6">
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
            <Database size={20} />
          </div>

          <h3 className="text-sm font-semibold text-white">
            What happens after Save?
          </h3>

          <div className="mt-5 space-y-4">
            {[
              "Your engineering knowledge is sent to Hindsight.",
              "Hindsight processes and stores the memory.",
              "The memory becomes available for future recall.",
              "Related memories can be connected automatically.",
            ].map((item, index) => (
              <div
                key={item}
                className="flex gap-3"
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-[9px] text-amber-300">
                  {index + 1}
                </div>

                <div className="text-xs leading-5 text-white/35">
                  {item}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   EXPLORER
========================================================= */

function ExplorerSection({
  memories,
  loading,
  refresh,
}: {
  memories: Memory[];
  loading: boolean;
  refresh: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return memories;

    const query = search.toLowerCase();

    return memories.filter((memory) =>
      `${memory.text} ${memory.context ?? ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [memories, search]);

  return (
    <section>
      <WorkspaceHeader
        title="Memory Explorer"
        description="Browse the knowledge DevRecall has retained about your project."
        icon={<Search size={22} />}
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Filter memories..."
            className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/20"
          />
        </div>

        <button
          onClick={refresh}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] px-4 py-3 text-xs text-white/40 transition hover:text-white"
        >
          <RefreshCw
            size={13}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="mb-4 text-xs text-white/25">
        Showing {filtered.length} of {memories.length} memories
      </div>

      <div className="space-y-3">
        {loading ? (
          <LoadingCard />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Database size={22} />}
            title="No memories found"
            description="Capture some project knowledge and it will appear here."
          />
        ) : (
          filtered.map((memory, index) => (
            <motion.div
              key={memory.id || index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: Math.min(index * 0.025, 0.3),
              }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:border-blue-400/15"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
                  <Brain size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-sm leading-7 text-white/70">
                    {memory.text}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/25">
                    {memory.type && (
                      <span className="rounded-full border border-white/[0.06] px-2 py-1">
                        {memory.type}
                      </span>
                    )}

                    {memory.context && (
                      <span className="rounded-full border border-white/[0.06] px-2 py-1">
                        {memory.context}
                      </span>
                    )}

                    {memory.mentioned_at && (
                      <span>
                        {formatDate(memory.mentioned_at)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

/* =========================================================
   TIMELINE
========================================================= */

function TimelineSection({
  memories,
}: {
  memories: Memory[];
}) {
  const sorted = useMemo(() => {
    return [...memories].sort((a, b) => {
      const first = a.mentioned_at
        ? new Date(a.mentioned_at).getTime()
        : 0;

      const second = b.mentioned_at
        ? new Date(b.mentioned_at).getTime()
        : 0;

      return second - first;
    });
  }, [memories]);

  return (
    <section>
      <WorkspaceHeader
        title="Project Timeline"
        description="A chronological view of the knowledge DevRecall has accumulated."
        icon={<Clock3 size={22} />}
      />

      {sorted.length === 0 ? (
        <EmptyState
          icon={<Clock3 size={22} />}
          title="Timeline is empty"
          description="Captured project memories will appear here."
        />
      ) : (
        <div className="relative ml-3 border-l border-white/[0.08] pl-7">
          {sorted.map((memory, index) => (
            <motion.div
              key={memory.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: Math.min(index * 0.035, 0.3),
              }}
              className="relative mb-6"
            >
              <div className="absolute -left-[35px] top-1.5 h-3 w-3 rounded-full border-2 border-[#05060a] bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,.7)]" />

              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-violet-300">
                  {memory.mentioned_at
                    ? formatDate(memory.mentioned_at)
                    : "Project Memory"}
                </div>

                <div className="text-sm leading-7 text-white/65">
                  {memory.text}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   GRAPH
========================================================= */

function GraphSection({
  memories,
}: {
  memories: Memory[];
}) {
  const [selected, setSelected] =
    useState<Memory | null>(null);

  const nodes = memories.slice(0, 10);

  return (
    <section>
      <WorkspaceHeader
        title="Memory Graph"
        description="Explore relationships between the memories in your project."
        icon={<Network size={22} />}
      />

      <div className="relative min-h-[580px] overflow-hidden rounded-3xl border border-white/[0.08] bg-[#080912]">
        {/* GRID */}

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* GLOW */}

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[100px]" />

        {nodes.length > 0 ? (
          <>
            {/* CONNECTIONS */}

            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 1000 580"
              preserveAspectRatio="none"
            >
              {nodes.slice(1).map((memory, index) => {
                const angle =
                  (index / Math.max(nodes.length - 1, 1)) *
                  Math.PI *
                  2;

                const x =
                  500 + Math.cos(angle) * 300;

                const y =
                  290 + Math.sin(angle) * 200;

                return (
                  <motion.line
                    key={memory.id || index}
                    x1="500"
                    y1="290"
                    x2={x}
                    y2={y}
                    stroke="rgba(167,139,250,.18)"
                    strokeWidth="2"
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      delay: index * 0.07,
                    }}
                  />
                );
              })}
            </svg>

            {/* CENTER */}

            <motion.button
              onClick={() => setSelected(null)}
              className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-300/30 bg-violet-400/10 text-violet-200 shadow-[0_0_55px_rgba(139,92,246,.3)]"
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <Brain size={30} />
            </motion.button>

            {/* NODES */}

            {nodes.slice(1).map((memory, index) => {
              const angle =
                (index / Math.max(nodes.length - 1, 1)) *
                Math.PI *
                2;

              const left =
                50 + Math.cos(angle) * 34;

              const top =
                50 + Math.sin(angle) * 34;

              const isSelected =
                selected?.id === memory.id;

              return (
                <motion.button
                  key={memory.id || index}
                  onClick={() => setSelected(memory)}
                  initial={{
                    opacity: 0,
                    scale: 0.5,
                  }}
                  animate={{
                    opacity: 1,
                    scale: isSelected ? 1.08 : 1,
                  }}
                  transition={{
                    delay: index * 0.06,
                  }}
                  className={`absolute w-40 -translate-x-1/2 -translate-y-1/2 rounded-xl border p-3 text-left backdrop-blur-md transition ${
                    isSelected
                      ? "border-cyan-400/30 bg-cyan-400/[0.08] shadow-[0_0_30px_rgba(34,211,238,.12)]"
                      : "border-white/[0.08] bg-black/60 hover:border-violet-400/25"
                  }`}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                  }}
                >
                  <div className="mb-1 flex items-center gap-2 text-[10px] text-cyan-300">
                    <GitBranch size={11} />
                    MEMORY
                  </div>

                  <div className="line-clamp-3 text-[10px] leading-4 text-white/45">
                    {memory.text}
                  </div>
                </motion.button>
              );
            })}

            {/* SELECTED */}

            <AnimatePresence>
              {selected && (
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
                    y: 10,
                  }}
                  className="absolute bottom-5 left-5 right-5 rounded-2xl border border-cyan-400/15 bg-[#080912]/90 p-5 backdrop-blur-xl md:left-auto md:w-[390px]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                      <Brain size={14} />
                      Selected Memory
                    </div>

                    <button
                      onClick={() => setSelected(null)}
                      className="text-white/25 hover:text-white"
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div className="text-sm leading-6 text-white/60">
                    {selected.text}
                  </div>

                  {selected.context && (
                    <div className="mt-3 text-[10px] text-white/25">
                      Context: {selected.context}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <EmptyState
              icon={<Network size={22} />}
              title="No graph data"
              description="Capture project memories to populate the graph."
            />
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   INTELLIGENCE / HEALTH
========================================================= */

function SummarySection({
  stats,
  backendOnline,
}: {
  stats: Stats | null;
  backendOnline: boolean;
}) {
  return (
    <section>
      <WorkspaceHeader
        title="Project Intelligence"
        description="Live health and statistics from your Hindsight memory bank."
        icon={<BarChart3 size={22} />}
      />

      {/* HEALTH */}

      <div className="mb-5 rounded-3xl border border-white/[0.08] bg-[#080912] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">
              Memory Health
            </div>

            <div className="mt-1 text-xs text-white/30">
              Current Hindsight system state
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] ${
              backendOnline
                ? "border-emerald-400/20 bg-emerald-400/[0.05] text-emerald-300"
                : "border-red-400/20 bg-red-400/[0.05] text-red-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                backendOnline
                  ? "bg-emerald-400"
                  : "bg-red-400"
              }`}
            />

            {backendOnline ? "HEALTHY" : "OFFLINE"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <HealthMetric
            label="Nodes"
            value={stats?.total_nodes ?? 0}
            icon={<Database size={16} />}
            color="amber"
          />

          <HealthMetric
            label="Connections"
            value={stats?.total_links ?? 0}
            icon={<Network size={16} />}
            color="fuchsia"
          />

          <HealthMetric
            label="Documents"
            value={stats?.total_documents ?? 0}
            icon={<Code2 size={16} />}
            color="cyan"
          />

          <HealthMetric
            label="Observations"
            value={stats?.total_observations ?? 0}
            icon={<Lightbulb size={16} />}
            color="emerald"
          />
        </div>
      </div>

      {/* STATUS */}

      <div className="grid gap-4 lg:grid-cols-2">
        <DataPanel title="Operations">
          <DataRow
            label="Pending operations"
            value={formatNumber(
              stats?.pending_operations,
            )}
          />

          <DataRow
            label="Failed operations"
            value={formatNumber(
              stats?.failed_operations,
            )}
          />

          <DataRow
            label="Pending consolidation"
            value={formatNumber(
              stats?.pending_consolidation,
            )}
          />

          <DataRow
            label="Failed consolidation"
            value={formatNumber(
              stats?.failed_consolidation,
            )}
          />
        </DataPanel>

        <DataPanel title="Memory System">
          <DataRow
            label="Bank"
            value={stats?.bank_id ?? "devrecall"}
          />

          <DataRow
            label="Last write"
            value={formatDate(
              stats?.last_memory_write_at,
            )}
          />

          <DataRow
            label="Last consolidation"
            value={formatDate(
              stats?.last_consolidated_at,
            )}
          />
        </DataPanel>
      </div>

      {/* LINKS */}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <DataPanel title="Fact Types">
          {Object.entries(
            stats?.nodes_by_fact_type ?? {},
          ).map(([key, value]) => (
            <DataRow
              key={key}
              label={key}
              value={formatNumber(value)}
            />
          ))}
        </DataPanel>

        <DataPanel title="Memory Connections">
          {Object.entries(
            stats?.links_by_link_type ?? {},
          ).map(([key, value]) => (
            <DataRow
              key={key}
              label={key}
              value={formatNumber(value)}
            />
          ))}
        </DataPanel>
      </div>
    </section>
  );
}

function HealthMetric({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  color:
    | "amber"
    | "fuchsia"
    | "cyan"
    | "emerald";
}) {
  const colors = {
    amber: "bg-amber-400/10 text-amber-300",
    fuchsia: "bg-fuchsia-400/10 text-fuchsia-300",
    cyan: "bg-cyan-400/10 text-cyan-300",
    emerald: "bg-emerald-400/10 text-emerald-300",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <div
        className={`mb-4 flex h-9 w-9 items-center justify-center rounded-lg ${colors[color]}`}
      >
        {icon}
      </div>

      <div className="text-2xl font-semibold text-white">
        {formatNumber(value)}
      </div>

      <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/25">
        {label}
      </div>
    </div>
  );
}

function DataPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
      <div className="mb-4 text-sm font-semibold text-white">
        {title}
      </div>

      <div className="space-y-1">{children}</div>
    </div>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 hover:bg-white/[0.025]">
      <span className="text-xs capitalize text-white/35">
        {label.replaceAll("_", " ")}
      </span>

      <span className="max-w-[65%] truncate text-xs font-medium text-white/60">
        {value}
      </span>
    </div>
  );
}

/* =========================================================
   WHY DEVRECALL
========================================================= */

function WhySection() {
  const points = [
    {
      icon: <History size={20} />,
      title: "AI forgets project reasoning",
      text: "Traditional coding assistants can understand current code, but project-specific decisions and context can disappear between conversations.",
    },
    {
      icon: <Database size={20} />,
      title: "Hindsight provides durable memory",
      text: "DevRecall uses Hindsight as a long-term memory layer for retaining project knowledge and making it available later.",
    },
    {
      icon: <Search size={20} />,
      title: "Recall finds relevant context",
      text: "Instead of putting the entire project history into every prompt, DevRecall retrieves context relevant to the current question.",
    },
    {
      icon: <Brain size={20} />,
      title: "Reflect turns memory into reasoning",
      text: "The reflection layer synthesizes remembered context into a useful answer instead of simply returning raw memory fragments.",
    },
  ];

  return (
    <section>
      <WorkspaceHeader
        title="Why DevRecall?"
        description="The problem, the memory layer, and the reasoning behind persistent engineering context."
        icon={<CircleHelp size={22} />}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {points.map((point, index) => (
          <motion.div
            key={point.title}
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.07,
            }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
              {point.icon}
            </div>

            <h3 className="text-base font-semibold text-white">
              {point.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/40">
              {point.text}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-violet-400/15 bg-violet-400/[0.035] p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-violet-300">
            <Sparkles size={20} />
          </div>

          <div>
            <div className="text-sm font-semibold text-white">
              The core idea
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-white/45">
              DevRecall is a persistent memory layer for
              engineering context — preserving the reasoning behind
              a codebase so future questions can be answered with
              the project&apos;s own history in mind.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   EMPTY / LOADING
========================================================= */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] px-6 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04] text-white/25">
        {icon}
      </div>

      <div className="text-sm font-medium text-white/60">
        {title}
      </div>

      <div className="mt-2 max-w-sm text-xs leading-5 text-white/25">
        {description}
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.025]">
      <div className="flex items-center gap-3 text-xs text-white/30">
        <RefreshCw
          size={16}
          className="animate-spin"
        />
        Loading memory...
      </div>
    </div>
  );
}

/* =========================================================
   MAIN APP
========================================================= */

export default function DevRecallApp() {
  const [activeTab, setActiveTab] =
    useState<Tab>("ask");

  const [stats, setStats] =
    useState<Stats | null>(null);

  const [statsLoading, setStatsLoading] =
    useState(true);

  const [memories, setMemories] =
    useState<Memory[]>([]);

  const [memoriesLoading, setMemoriesLoading] =
    useState(true);

  const [backendOnline, setBackendOnline] =
    useState(false);

  const [demoRunning, setDemoRunning] =
    useState(false);

  const [demoStep, setDemoStep] =
    useState(-1);

  /* =======================================================
     LOAD STATS
  ======================================================= */

  const loadStats = useCallback(async () => {
    try {
      setStatsLoading(true);

      const response = await fetch(
        `${API_URL}/stats`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Stats unavailable");
      }

      const data: ApiResponse =
        await response.json();

      setStats(data.stats ?? null);
      setBackendOnline(true);
    } catch {
      setBackendOnline(false);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  /* =======================================================
     LOAD MEMORIES
  ======================================================= */

  const loadMemories = useCallback(async () => {
    try {
      setMemoriesLoading(true);

      const response = await fetch(
        `${API_URL}/memories`,
        {
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error("Memories unavailable");
      }

      const data: ApiResponse =
        await response.json();

      setMemories(data.memories ?? []);
    } catch {
      setMemories([]);
    } finally {
      setMemoriesLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadStats();
    loadMemories();

    const interval = setInterval(() => {
      loadStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadStats, loadMemories]);

  /* =======================================================
     DEMO MODE
  ======================================================= */

  const runDemo = async () => {
    if (demoRunning) return;

    setDemoRunning(true);

    try {
      /* RETAIN */

      setDemoStep(0);

      await new Promise((resolve) =>
        setTimeout(resolve, 1200),
      );

      /* RECALL */

      setDemoStep(1);

      await new Promise((resolve) =>
        setTimeout(resolve, 1400),
      );

      /* REFLECT */

      setDemoStep(2);

      await new Promise((resolve) =>
        setTimeout(resolve, 1800),
      );

      await loadStats();
      await loadMemories();

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );
    } finally {
      setDemoStep(-1);
      setDemoRunning(false);
    }
  };

  /* =======================================================
     COUNTERS
  ======================================================= */

  const nodeCount =
    stats?.total_nodes ?? 0;

  const linkCount =
    stats?.total_links ?? 0;

  const documentCount =
    stats?.total_documents ?? 0;

  /* =======================================================
     WORKSPACE
  ======================================================= */

  const workspace = useMemo(() => {
    switch (activeTab) {
      case "ask":
        return <AskSection />;

      case "capture":
        return (
          <CaptureSection
            onStored={async () => {
              await Promise.all([
                loadStats(),
                loadMemories(),
              ]);
            }}
          />
        );

      case "explorer":
        return (
          <ExplorerSection
            memories={memories}
            loading={memoriesLoading}
            refresh={loadMemories}
          />
        );

      case "timeline":
        return (
          <TimelineSection
            memories={memories}
          />
        );

      case "graph":
        return (
          <GraphSection
            memories={memories}
          />
        );

      case "summary":
        return (
          <SummarySection
            stats={stats}
            backendOnline={backendOnline}
          />
        );

      case "why":
        return <WhySection />;

      default:
        return <AskSection />;
    }
  }, [
    activeTab,
    backendOnline,
    loadMemories,
    loadStats,
    memories,
    memoriesLoading,
    stats,
  ]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#05060a] text-white">
      {/* GLOBAL AMBIENCE */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[20%] top-[-20%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.035] blur-[120px]" />

        <div className="absolute right-[-10%] top-[30%] h-[400px] w-[400px] rounded-full bg-cyan-600/[0.025] blur-[120px]" />
      </div>

      {/* SIDEBAR */}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendOnline={backendOnline}
      />

      {/* MAIN */}

      <main className="relative min-h-screen lg:ml-[270px]">
        <div className="mx-auto max-w-[1500px] px-4 py-5 pb-24 md:px-7 md:py-7 lg:px-10 lg:pb-10">
          {/* TOP BAR */}

          <header className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-violet-500/10">
                <Brain
                  size={19}
                  className="text-violet-300"
                />
              </div>

              <span className="text-sm font-semibold">
                DevRecall
              </span>
            </div>

            <div className="hidden lg:block">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                Project Memory System
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  backendOnline
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]"
                    : "bg-red-400"
                }`}
              />

              <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                {backendOnline
                  ? "Memory online"
                  : "Memory offline"}
              </span>
            </div>
          </header>

          {/* =================================================
              MEMORY CORE
              HERO ONLY EXISTS ON THIS TAB
          ================================================= */}

          {activeTab === "ask" && (
            <>
              <Hero
                nodeCount={nodeCount}
                linkCount={linkCount}
                documentCount={documentCount}
                demoRunning={demoRunning}
                demoStep={demoStep}
                runDemo={runDemo}
              />

              <LiveStats
                stats={stats}
                loading={statsLoading}
              />

              <Pipeline
                activeStep={demoStep}
              />
            </>
          )}

          {/* =================================================
              WORKSPACE
              OTHER TABS START HERE
          ================================================= */}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.22,
                ease: "easeOut",
              }}
              className={
                activeTab === "ask"
                  ? "mt-8"
                  : "mt-2"
              }
            >
              {workspace}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* MOBILE */}

      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}