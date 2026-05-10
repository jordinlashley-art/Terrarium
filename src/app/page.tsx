export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Terrarium
          </span>
          <nav className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
            <a
              href="https://nextjs.org/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 mx-auto max-w-5xl px-6 py-24 flex flex-col items-center text-center gap-10">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            Next.js 16 &nbsp;·&nbsp; Tailwind CSS 4 &nbsp;·&nbsp; TypeScript
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-2xl leading-tight">
            Build something remarkable
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
            Terrarium is your modern project starter — wired up with Next.js App
            Router, Tailwind CSS utility classes, and full TypeScript support
            right out of the box.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://nextjs.org/docs/app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-900 dark:bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-50 dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            Read the docs
          </a>
          <a
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Learn Next.js
          </a>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 text-left flex flex-col gap-2"
            >
              <span className="text-2xl">{feature.icon}</span>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-600">
          <span>Terrarium</span>
          <span>
            Powered by{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-600 dark:hover:text-zinc-400 underline underline-offset-2 transition-colors"
            >
              Next.js
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "⚡",
    title: "App Router",
    description:
      "Leverage Next.js App Router with server components, layouts, loading states, and nested routing built in.",
  },
  {
    icon: "🎨",
    title: "Tailwind CSS 4",
    description:
      "Utility-first styling with Tailwind v4 — faster builds, a cleaner config, and full dark mode support.",
  },
  {
    icon: "🔷",
    title: "TypeScript",
    description:
      "End-to-end type safety with strict TypeScript configured out of the box for scalable development.",
  },
];
