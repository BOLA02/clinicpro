"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  // keyboard handler for radio-like buttons
  const handleOptionKeyDown = (e, targetIsDark) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if ((targetIsDark && !isDark) || (!targetIsDark && isDark)) toggle();
    }

    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      if (isDark) toggle();
    }

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      if (!isDark) toggle();
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-text-primary">Color Theme</p>
          <p className="text-sm text-text-secondary" id="theme-status">
            {isDark ? "Dark Mode" : "Light Mode"} is currently active
          </p>
        </div>
        <button
          onClick={toggle}
          aria-pressed={isDark}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          role="switch"
          aria-checked={isDark}
          className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
            isDark ? "bg-primary" : "bg-surface-hover"
          }`}
        >
          <span
            className={`inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform ${
              isDark ? "translate-x-8" : "translate-x-0.5"
            }`}
          >
            <span className="sr-only">Toggle theme</span>
            {isDark ? (
              <Moon className="w-4 h-4 text-primary" aria-hidden />
            ) : (
              <Sun className="w-4 h-4 text-warning" aria-hidden />
            )}
          </span>
        </button>
      </div>

      {/* Theme Options as accessible radiogroup */}
      <div className="grid grid-cols-2 gap-3 pt-4" role="radiogroup" aria-labelledby="theme-status">
        <button
          role="radio"
          aria-checked={!isDark}
          tabIndex={!isDark ? 0 : -1}
          onKeyDown={(e) => handleOptionKeyDown(e, false)}
          onClick={() => {
            if (isDark) toggle();
          }}
          className={`p-4 rounded-lg border-2 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary ${
            !isDark ? "border-primary bg-blue-50" : "border-border bg-surface-hover"
          }`}
        >
          <Sun className="w-5 h-5 mx-auto mb-2" aria-hidden />
          <p className="text-sm font-medium text-text-primary">Light</p>
          <span className="sr-only">Select light theme</span>
        </button>

        <button
          role="radio"
          aria-checked={isDark}
          tabIndex={isDark ? 0 : -1}
          onKeyDown={(e) => handleOptionKeyDown(e, true)}
          onClick={() => {
            if (!isDark) toggle();
          }}
          className={`p-4 rounded-lg border-2 transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary ${
            isDark ? "border-primary bg-blue-50" : "border-border bg-surface-hover"
          }`}
        >
          <Moon className="w-5 h-5 mx-auto mb-2" aria-hidden />
          <p className="text-sm font-medium text-text-primary">Dark</p>
          <span className="sr-only">Select dark theme</span>
        </button>
      </div>
    </div>
  );
}
