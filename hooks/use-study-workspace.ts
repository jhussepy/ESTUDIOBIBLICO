"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isColorMode,
  isColorPalette,
  resolveColorMode,
  type ColorMode,
  type ColorPalette,
} from "@/lib/theme-palettes";

export type ReadingScale = "small" | "normal" | "large";

interface StudyWorkspaceState {
  version: 1;
  completedByStudy: Record<string, number[]>;
  bookmarks: string[];
  notes: Record<string, string>;
  preferences: {
    readingScale: ReadingScale;
    focusMode: boolean;
    colorPalette: ColorPalette;
    colorMode: ColorMode;
    highContrast: boolean;
  };
}

const STORAGE_KEY = "academia-biblica.workspace.v1";

const initialState: StudyWorkspaceState = {
  version: 1,
  completedByStudy: {},
  bookmarks: [],
  notes: {},
  preferences: {
    readingScale: "normal",
    focusMode: false,
    colorPalette: "manuscript",
    colorMode: "system",
    highContrast: false,
  },
};

function normalizeWorkspace(value: unknown): StudyWorkspaceState {
  if (!value || typeof value !== "object") return initialState;
  const candidate = value as Partial<StudyWorkspaceState>;
  const preferences = candidate.preferences;
  const readingScale =
    preferences?.readingScale === "small" ||
    preferences?.readingScale === "large" ||
    preferences?.readingScale === "normal"
      ? preferences.readingScale
      : "normal";
  const colorPalette = isColorPalette(preferences?.colorPalette)
    ? preferences.colorPalette
    : "manuscript";
  const colorMode = isColorMode(preferences?.colorMode)
    ? preferences.colorMode
    : "system";

  return {
    version: 1,
    completedByStudy:
      candidate.completedByStudy && typeof candidate.completedByStudy === "object"
        ? Object.fromEntries(
            Object.entries(candidate.completedByStudy as Record<string, unknown>)
              .filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))
              .map(([key, verses]) => [
                key,
                [...new Set(verses.filter((verse): verse is number => Number.isInteger(verse) && (verse as number) > 0))],
              ]),
          )
        : {},
    bookmarks: Array.isArray(candidate.bookmarks)
      ? candidate.bookmarks.filter((item): item is string => typeof item === "string")
      : [],
    notes:
      candidate.notes && typeof candidate.notes === "object"
        ? Object.fromEntries(
            Object.entries(candidate.notes).filter(
              (entry): entry is [string, string] => typeof entry[1] === "string",
            ),
          )
        : {},
    preferences: {
      readingScale,
      focusMode: Boolean(preferences?.focusMode),
      colorPalette,
      colorMode,
      highContrast: Boolean(preferences?.highContrast),
    },
  };
}

export function useStudyWorkspace() {
  const [workspace, setWorkspace] = useState<StudyWorkspaceState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    let nextWorkspace = initialState;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) nextWorkspace = normalizeWorkspace(JSON.parse(saved));
    } catch {
      // A damaged or unavailable local store should never block Bible reading.
    }
    queueMicrotask(() => {
      if (!active) return;
      setWorkspace(nextWorkspace);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch {
      // Private browsing or storage limits may prevent persistence.
    }
  }, [hydrated, workspace]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    function applyAppearance() {
      root.dataset.palette = workspace.preferences.colorPalette;
      root.dataset.colorMode = resolveColorMode(workspace.preferences.colorMode, media.matches);
      root.dataset.highContrast = workspace.preferences.highContrast ? "true" : "false";
    }

    applyAppearance();
    if (workspace.preferences.colorMode !== "system") return;

    media.addEventListener("change", applyAppearance);
    return () => media.removeEventListener("change", applyAppearance);
  }, [
    workspace.preferences.colorMode,
    workspace.preferences.colorPalette,
    workspace.preferences.highContrast,
  ]);

  const setCompletedVerses = useCallback(
    (studyKey: string, update: (verses: number[]) => number[]) => {
      setWorkspace((current) => ({
        ...current,
        completedByStudy: {
          ...current.completedByStudy,
          [studyKey]: update(current.completedByStudy[studyKey] ?? []),
        },
      }));
    },
    [],
  );

  const toggleBookmark = useCallback((verseKey: string) => {
    setWorkspace((current) => ({
      ...current,
      bookmarks: current.bookmarks.includes(verseKey)
        ? current.bookmarks.filter((item) => item !== verseKey)
        : [...current.bookmarks, verseKey],
    }));
  }, []);

  const setNote = useCallback((verseKey: string, note: string) => {
    setWorkspace((current) => ({
      ...current,
      notes: { ...current.notes, [verseKey]: note },
    }));
  }, []);

  const setReadingScale = useCallback((readingScale: ReadingScale) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, readingScale },
    }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setWorkspace((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        focusMode: !current.preferences.focusMode,
      },
    }));
  }, []);

  const setColorPalette = useCallback((colorPalette: ColorPalette) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, colorPalette },
    }));
  }, []);

  const setColorMode = useCallback((colorMode: ColorMode) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, colorMode },
    }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setWorkspace((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        highContrast: !current.preferences.highContrast,
      },
    }));
  }, []);

  return {
    ...workspace,
    hydrated,
    setCompletedVerses,
    toggleBookmark,
    setNote,
    setReadingScale,
    toggleFocusMode,
    setColorPalette,
    setColorMode,
    toggleHighContrast,
  };
}
