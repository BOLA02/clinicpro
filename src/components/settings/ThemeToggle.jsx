"use client";

import  { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-text-primary">Color Theme</p>
          <p className="text-sm text-text-secondary">
            {isDarkMode ? "Dark Mode" : "Light Mode"} is currently active
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors ${
            isDarkMode ? "bg-primary" : "bg-surface-hover"
          }`}
        >
          <span
            className={`inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform ${
              isDarkMode ? "translate-x-8" : "translate-x-0.5"
            }`}
          >
            {isDarkMode ? (
              <Moon className="w-4 h-4 text-primary" />
            ) : (
              <Sun className="w-4 h-4 text-warning" />
            )}
          </span>
        </button>
      </div>

      {/* Theme Options */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <button
          onClick={() => {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
          }}
          className={`p-4 rounded-lg border-2 transition-colors text-center ${
            !isDarkMode ? "border-primary bg-blue-50" : "border-border bg-surface-hover"
          }`}
        >
          <Sun className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">Light</p>
        </button>

        <button
          onClick={() => {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
          }}
          className={`p-4 rounded-lg border-2 transition-colors text-center ${
            isDarkMode ? "border-primary bg-blue-50" : "border-border bg-surface-hover"
          }`}
        >
          <Moon className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm font-medium text-text-primary">Dark</p>
        </button>
      </div>
    </div>
  );
}
