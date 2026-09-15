"use client";

import { useEffect } from "react";

import {
  isColorMode,
  isColorPalette,
  resolveColorMode,
} from "@/lib/theme-palettes";

const STORAGE_KEY = "academia-biblica.workspace.v1";

function readSavedAppearance() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}") as {
      preferences?: {
        colorPalette?: unknown;
        colorMode?: unknown;
        highContrast?: unknown;
      };
    };
    const preferences = saved.preferences;
    return {
      palette: isColorPalette(preferences?.colorPalette)
        ? preferences.colorPalette
        : "manuscript",
      mode: isColorMode(preferences?.colorMode) ? preferences.colorMode : "system",
      highContrast: Boolean(preferences?.highContrast),
    };
  } catch {
    return {
      palette: "manuscript" as const,
      mode: "system" as const,
      highContrast: false,
    };
  }
}

export function AppearanceSync() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function synchronize() {
      const appearance = readSavedAppearance();
      root.dataset.palette = appearance.palette;
      root.dataset.colorMode = resolveColorMode(appearance.mode, media.matches);
      root.dataset.highContrast = appearance.highContrast ? "true" : "false";
    }

    synchronize();
    media.addEventListener("change", synchronize);
    window.addEventListener("storage", synchronize);

    return () => {
      media.removeEventListener("change", synchronize);
      window.removeEventListener("storage", synchronize);
    };
  }, []);

  return null;
}
