"use client";

import Link from "next/link";
import { motion } from "motion/react";

const features = [
  {
    number: "01",
    title: "Retain",
    description:
      "Capture architectural decisions, debugging discoveries, preferences, and project context as durable memory.",
  },
  {
    number: "02",
    title: "Recall",
    description:
      "Retrieve the project-specific context that matters instead of starting every conversation from zero.",
  },
  {
    number: "03",
    title: "Reflect",
    description:
      "Synthesize related memories into a useful explanation instead of simply returning raw search results.",
  },
];

const architecture = [
  "Your Project",
  "DevRecall",
  "Hindsight",
  "Memory",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[650px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />
        <div className="absolute right-[-200px] top-[35%] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />
        <div className="absolute left-[-200px] top-[70%] h-[450px] w-[450px] rounded-full bg-cyan-500/5 blur-[140px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06]">
            <span className="text-sm font-bold">D</span>
          </div>

          <span className="text-lg font-semibold tracking-tight">
            DevRecall
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-zinc-400 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-white"
          >
            How it works
          </a>

          <a
            href="#architecture"
            className="transition hover:text-white"
          >
            Architecture
          </a>
        </div>

        <Link
          href="/app"
          className="rounded-full border border-white/10 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          Open DevRecall →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-28 pt-24 lg:px-8 lg:pb-36 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
            Long-term memory for AI coding assistants
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl font-semibold tracking-[-0.04em] sm:text-6xl lg:text-8xl"
          >
            Your AI should
            <br />
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              remember.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg"
          >
            DevRecall gives your coding assistant persistent project memory —
            so architectural decisions, debugging discoveries, and engineering
            context don&apos;t disappear between conversations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/app"
              className="group rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-zinc-200"
            >
              Try DevRecall
              <span className="ml-2 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>

            <a
              href="#how-it-works"
              className="rounded-full border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Hero Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="relative rounded-3xl border border-white/10 bg-white/[0.025] p-2 shadow-2xl shadow-black">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#090909]">
              {/* Window bar */}
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />

                <div className="ml-5 flex-1 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-1.5 text-center text-xs text-zinc-600">
                  devrecall.local
                </div>
              </div>

              {/* Mock application */}
              <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-[190px_1fr]">
                <aside className="hidden border-r border-white/10 p-5 md:block">
                  <div className="mb-8 text-sm font-semibold">
                    DevRecall
                  </div>

                  <div className="space-y-2 text-xs text-zinc-500">
                    <div className="rounded-lg bg-white/[0.06] px-3 py-2 text-white">
                      Ask
                    </div>
                    <div className="px-3 py-2">Capture Memory</div>
                    <div className="px-3 py-2">Explore</div>
                  </div>
                </aside>

                <div className="p-6 sm:p-10">
                  <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">
                      Memory synthesis
                    </p>

                    <h3 className="mt-3 text-xl font-medium">
                      Why did we choose PostgreSQL?
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold text-black">
                        D
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          DevRecall
                        </p>
                        <p className="text-[11px] text-zinc-600">
                          Synthesized from project memory
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-7 text-zinc-400">
                      The project moved from MongoDB to PostgreSQL because the
                      payment system required reliable ACID transactions.
                      Redis was retained separately for caching.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-500">
                        architecture
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-500">
                        database
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-500">
                        ACID
                      </span>

                      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-zinc-500">
                        Redis
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Problem */}
      <section
        id="how-it-works"
        className="relative z-10 border-t border-white/5"
      >
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-2 lg:px-8 lg:py-36">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
              The problem
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
              AI can generate code.
              <br />
              <span className="text-zinc-500">
                But does it know why?
              </span>
            </h2>
          </div>

          <div className="space-y-6 text-zinc-400">
            <p className="leading-7">
              Modern coding assistants are excellent at working with the
              context you give them. But important project knowledge can become
              fragmented across conversations, documents, commits, and
              developers.
            </p>

            <p className="leading-7">
              DevRecall creates a persistent memory layer for your coding
              assistant, allowing it to retain project decisions and later
              recall or synthesize them when they become relevant.
            </p>

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <div className="text-xs uppercase tracking-widest text-zinc-600">
                Without memory
              </div>

              <p className="mt-3 text-sm text-zinc-500">
                &quot;I don&apos;t have enough project-specific context to
                know why this decision was made.&quot;
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-xs uppercase tracking-widest text-zinc-500">
                With DevRecall
              </div>

              <p className="mt-3 text-sm text-zinc-300">
                &quot;The database was migrated because the payment system
                required reliable ACID transactions.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="relative z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
              Memory engine
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Three layers of memory.
            </h2>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="group rounded-3xl border border-white/10 bg-white/[0.025] p-7 transition hover:bg-white/[0.045]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-600">
                    {feature.number}
                  </span>

                  <span className="text-zinc-700 transition group-hover:text-zinc-400">
                    ↗
                  </span>
                </div>

                <h3 className="mt-14 text-2xl font-medium">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section
        id="architecture"
        className="relative z-10 border-t border-white/5"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-8 lg:py-36">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-600">
              Architecture
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              A memory layer for your AI stack.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-500">
              DevRecall connects your application to persistent project memory
              through a simple orchestration layer powered by Hindsight.
            </p>
          </div>

          <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center justify-center gap-3 md:flex-row">
            {architecture.map((item, index) => (
              <div
                key={item}
                className="flex w-full items-center justify-center md:w-auto"
              >
                <div className="min-w-[150px] rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-5 text-center">
                  <div className="text-sm font-medium">{item}</div>

                  <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-600">
                    {index === 0 && "Context"}
                    {index === 1 && "Orchestrator"}
                    {index === 2 && "Memory engine"}
                    {index === 3 && "Persistent"}
                  </div>
                </div>

                {index < architecture.length - 1 && (
                  <div className="hidden px-3 text-zinc-700 md:block">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-6 py-32 text-center lg:py-40">
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
            Give your assistant context
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
            Stop explaining your project
            <br />
            <span className="text-zinc-500">over and over.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-500">
            Build with an AI assistant that can remember the decisions,
            discoveries, and context that make your project yours.
          </p>

          <Link
            href="/app"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-zinc-200"
          >
            Open DevRecall →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 py-8 text-xs text-zinc-600 sm:flex-row lg:px-8">
          <div>
            © 2026 DevRecall. Built with Hindsight.
          </div>

          <div className="flex gap-6">
            <span>Long-term AI memory</span>
            <span>Developer tools</span>
          </div>
        </div>
      </footer>
    </main>
  );
}