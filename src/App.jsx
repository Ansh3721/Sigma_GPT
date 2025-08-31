// src/App.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User2, Moon, Sun, Menu, ChevronLeft } from "lucide-react";

// Import your refactored components
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";

export default function App() {
  // State remains here as it controls the whole app
  const [theme, setTheme] = useState("light");
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recent, setRecent] = useState([]);
  const [answer, setAnswer] = useState("");
  const fileInputRef = useRef(null);

  // Theme logic remains here
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--bg-color", "#18181b");
      root.style.setProperty("--text-color", "#fafaf9");
      root.style.setProperty("--border-color", "#27272a");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg-color", "#fafaf9");
      root.style.setProperty("--text-color", "#18181b");
      root.style.setProperty("--border-color", "#e5e5e5");
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // Handler logic remains here
  const submitQuery = (q) => {
    const text = (q ?? query).trim();
    if (!text) return;
    setIsSearching(true);
    setRecent((r) => [text, ...r.filter((x) => x !== text)].slice(0, 12));
    setAnswer(""); // You would fetch your real AI answer here
    setSidebarOpen(false);
  };

  const onFilePick = () => fileInputRef.current?.click();

  const containerClasses = useMemo(() =>
    ["min-h-screen w-full transition-colors duration-300", "bg-[var(--bg-color)] text-[var(--text-color)]"].join(" "),
    []
  );

  return (
    <div className={containerClasses}>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-neutral-100/50 dark:to-neutral-900/40" />
      
      {/* Header */}
      <header className="fixed top-0 right-0 z-40 p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] dark:border-[var(--border-color)] dark:bg-[var(--bg-color)] dark:text-[var(--text-color)] backdrop-blur px-3 py-2 shadow-sm hover:shadow transition flex items-center gap-2"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          <span className="hidden sm:block text-sm font-medium">{theme === "light" ? "Dark" : "Light"}</span>
        </button>
        <button
          aria-label="Account"
          className={`rounded-full border backdrop-blur p-2 shadow-sm hover:shadow transition ${theme === "dark" ? "bg-[var(--bg-color)]/40" : "bg-[var(--bg-color)]/40"}`}
        >
          <User2 size={18} />
        </button>
      </header>

      {/* Mobile top bar to open sidebar */}
      <div className="fixed top-3 left-3 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className={`rounded-2xl border border-neutral-200/70 dark:border-neutral-800/70 backdrop-blur px-3 py-2 shadow-sm hover:shadow transition flex items-center gap-2 ${theme === "dark" ? "bg-[var(--bg-color)]/40" : "bg-[var(--bg-color)]/40"}`}
        >
          <Menu size={18} /> <span className="text-sm font-medium">Menu</span>
        </button>
      </div>

      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        recent={recent}
        submitQuery={submitQuery}
        theme={theme}
      />

      {/* Main area */}
      <div className="relative flex min-h-screen">
        <AnimatePresence initial={false}>
          {!isSearching ? (
            <motion.main
              key="center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center px-4 text-center"
            >
              <div className="mb-8">
                <div className="text-4xl sm:text-5xl font-semibold tracking-tight">Startup.ai</div>
                <p className="mt-3 text-neutral-600 dark:text-neutral-400">Ask anything. Build faster.</p>
              </div>
              <SearchBar value={query} onChange={setQuery} onSubmit={() => submitQuery()} onPickFile={onFilePick} />
            </motion.main>
          ) : (
            <main className="flex w-full flex-col px-4 md:px-6 lg:px-8 pt-20 md:pt-10 pb-36 max-w-[1200px] mx-auto">
              <div className="h-1" />
              <div className="hidden md:flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                <button
                  onClick={() => setIsSearching(false)}
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <ChevronLeft size={16} /> Home
                </button>
                <span>/</span>
                <span>Results</span>
              </div>
              <section className="mt-4 space-y-4">
                <div className="text-2xl font-semibold tracking-tight line-clamp-2">{recent[0]}</div>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/50 backdrop-blur p-5 shadow-sm"
                >
                  <pre className="whitespace-pre-wrap text-sm leading-6">{answer}</pre>
                </motion.div>
              </section>
              <div className="fixed left-0 right-0 bottom-0 z-30">
                <div className="mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 pb-4">
                  <SearchBar value={query} onChange={setQuery} onSubmit={() => submitQuery()} onPickFile={onFilePick} compact />
                </div>
              </div>
            </main>
          )}
        </AnimatePresence>
      </div>

      <input ref={fileInputRef} type="file" multiple className="hidden" />
    </div>
  );
}