import React from "react";
import { User2, Moon, Sun } from "lucide-react";

export default function Header({ theme, toggleTheme }) {
  return (
    <header className="fixed top-0 right-0 z-40 p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-color)] text-[var(--text-color)] dark:border-[var(--border-color)] dark:bg-[var(--bg-color)] dark:text-[var(--text-color)] backdrop-blur px-3 py-2 shadow-sm hover:shadow transition flex items-center gap-2"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        <span className="hidden sm:block text-sm font-medium">
          {theme === "light" ? "Dark" : "Light"}
        </span>
      </button>
      <button
        aria-label="Account"
        className="rounded-full border border-neutral-200/70 dark:border-neutral-800/70 backdrop-blur p-2 shadow-sm hover:shadow transition bg-white/60 dark:bg-neutral-900/50"
      >
        <User2 size={18} />
      </button>
    </header>
  );
}