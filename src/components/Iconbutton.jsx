// src/components/IconButton.jsx

import React from "react";

export default function IconButton({ children, onClick, title, primary = false }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      title={title}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center",
        "rounded-2xl",
        primary
          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
          : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-100",
        "px-3 py-2 shadow-sm hover:shadow transition",
        "border border-neutral-200 dark:border-neutral-700",
      ].join(" ")}
    >
      {children}
    </button>
  );
}