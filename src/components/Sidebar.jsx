// src/components/Sidebar.jsx - CORRECTED

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// CHANGE #1: Receive props named "isOpen" and "setIsOpen"
export default function Sidebar({
  isOpen,
  setIsOpen,
  recent,
  submitQuery,
  theme,
}) {
  return (
    <>
      {/* CHANGE #2: Check for "isOpen" to render */}
      {isOpen && (
        <AnimatePresence>
          <motion.div
            key="drawer"
            className={`fixed inset-0 z-50 backdrop-blur ${
              theme === "dark"
                ? "bg-[var(--bg-color)]/40"
                : "bg-[var(--bg-color)]/40"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)} // <-- CHANGE #3: Use "setIsOpen"
              aria-hidden
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              className={`absolute left-0 top-0 h-full w-[85%] max-w-[320px] ${
                theme === "dark"
                  ? "bg-[var(--bg-color)] dark:bg-neutral-900"
                  : "bg-[var(--bg-color)]"
              } border-r border-[var(--border-color)] dark:border-neutral-800 flex flex-col`}
            >
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] dark:border-neutral-800">
                <div className="text-lg font-semibold">Startup.ai</div>
                <button
                  onClick={() => setIsOpen(false)} // <-- CHANGE #4: Use "setIsOpen"
                  aria-label="Close"
                  className="rounded-xl p-2 hover:bg-[var(--bg-color)] dark:hover:bg-neutral-800"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-3 text-xs uppercase tracking-wide text-[var(--text-color)] dark:text-neutral-400">
                Recent
              </div>
              <nav className="px-2 pb-8 space-y-1 overflow-y-auto">
                {recent.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      submitQuery(item);
                      setIsOpen(false); // <-- CHANGE #5: Use "setIsOpen"
                    }}
                    className="w-full text-left rounded-xl px-3 py-2 hover:bg-[var(--bg-color)] dark:hover:bg-neutral-800/70 transition"
                  >
                    <span className="line-clamp-1 text-sm">{item}</span>
                  </button>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}