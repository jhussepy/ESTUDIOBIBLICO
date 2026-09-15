"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isColorMode,
  isColorPalette,
  resolveColorMode,
  type ColorMode,
  type ColorPalette,
} from "@/lib/theme-palettes";

export type ReadingScale = "small" | "normal" | "large" | "extra-large";
export type ReadingLineHeight = "compact" | "comfortable" | "spacious";
export type ReadingWidth = "narrow" | "balanced" | "wide";
export type ReadingFont = "serif" | "accessible";

export interface ReadingLocation {
  bibleId: string;
  bookId: string;
  chapterId: string;
  chapterNumber: number;
}

export interface StudyWorkspaceState {
  version: 1;
  completedByStudy: Record<string, number[]>;
  bookmarks: string[];
  notes: Record<string, string>;
  lastReading: ReadingLocation | null;
  preferences: {
    readingScale: ReadingScale;
    readingLineHeight: ReadingLineHeight;
    readingWidth: ReadingWidth;
    readingFont: ReadingFont;
    focusMode: boolean;
    rememberLastReading: boolean;
    defaultBibleId: string;
    reduceMotion: boolean;
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
  lastReading: null,
  preferences: {
    readingScale: "normal",
    readingLineHeight: "comfortable",
    readingWidth: "balanced",
    readingFont: "serif",
    focusMode: false,
    rememberLastReading: true,
    defaultBibleId: "",
    reduceMotion: false,
    colorPalette: "manuscript",
    colorMode: "system",
    highContrast: false,
  },
};

function normalizeReadingLocation(value: unknown): ReadingLocation | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<ReadingLocation>;
  if (
    typeof candidate.bibleId !== "string" ||
    typeof candidate.bookId !== "string" ||
    typeof candidate.chapterId !== "string" ||
    !Number.isInteger(candidate.chapterNumber) ||
    (candidate.chapterNumber ?? 0) < 1
  ) {
    return null;
  }
  return {
    bibleId: candidate.bibleId,
    bookId: candidate.bookId,
    chapterId: candidate.chapterId,
    chapterNumber: candidate.chapterNumber as number,
  };
}

function isWorkspaceBackup(value: unknown): value is Partial<StudyWorkspaceState> {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StudyWorkspaceState>;
  return (
    Array.isArray(candidate.bookmarks) &&
    Boolean(candidate.completedByStudy && typeof candidate.completedByStudy === "object") &&
    Boolean(candidate.notes && typeof candidate.notes === "object") &&
    Boolean(candidate.preferences && typeof candidate.preferences === "object")
  );
}

export function normalizeWorkspace(value: unknown): StudyWorkspaceState {
  if (!value || typeof value !== "object") return initialState;
  const candidate = value as Partial<StudyWorkspaceState>;
  const preferences = candidate.preferences;
  const readingScale =
    preferences?.readingScale === "small" ||
    preferences?.readingScale === "large" ||
    preferences?.readingScale === "extra-large" ||
    preferences?.readingScale === "normal"
      ? preferences.readingScale
      : "normal";
  const readingLineHeight =
    preferences?.readingLineHeight === "compact" ||
    preferences?.readingLineHeight === "spacious" ||
    preferences?.readingLineHeight === "comfortable"
      ? preferences.readingLineHeight
      : "comfortable";
  const readingWidth =
    preferences?.readingWidth === "narrow" ||
    preferences?.readingWidth === "wide" ||
    preferences?.readingWidth === "balanced"
      ? preferences.readingWidth
      : "balanced";
  const readingFont =
    preferences?.readingFont === "accessible" || preferences?.readingFont === "serif"
      ? preferences.readingFont
      : "serif";
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
    lastReading: normalizeReadingLocation(candidate.lastReading),
    preferences: {
      readingScale,
      readingLineHeight,
      readingWidth,
      readingFont,
      focusMode: Boolean(preferences?.focusMode),
      rememberLastReading:
        typeof preferences?.rememberLastReading === "boolean"
          ? preferences.rememberLastReading
          : true,
      defaultBibleId:
        typeof preferences?.defaultBibleId === "string"
          ? preferences.defaultBibleId
          : "",
      reduceMotion: Boolean(preferences?.reduceMotion),
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
    if (!hydrated) return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.palette = workspace.preferences.colorPalette;
    root.dataset.colorMode = resolveColorMode(workspace.preferences.colorMode, prefersDark);
    root.dataset.highContrast = workspace.preferences.highContrast ? "true" : "false";
    root.dataset.readingLineHeight = workspace.preferences.readingLineHeight;
    root.dataset.readingWidth = workspace.preferences.readingWidth;
    root.dataset.readingFont = workspace.preferences.readingFont;
    root.dataset.reduceMotion = workspace.preferences.reduceMotion ? "true" : "false";
  }, [
    hydrated,
    workspace.preferences.colorMode,
    workspace.preferences.colorPalette,
    workspace.preferences.highContrast,
    workspace.preferences.readingFont,
    workspace.preferences.readingLineHeight,
    workspace.preferences.readingWidth,
    workspace.preferences.reduceMotion,
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

  const setReadingLineHeight = useCallback((readingLineHeight: ReadingLineHeight) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, readingLineHeight },
    }));
  }, []);

  const setReadingWidth = useCallback((readingWidth: ReadingWidth) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, readingWidth },
    }));
  }, []);

  const setReadingFont = useCallback((readingFont: ReadingFont) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, readingFont },
    }));
  }, []);

  const setRememberLastReading = useCallback((rememberLastReading: boolean) => {
    setWorkspace((current) => ({
      ...current,
      lastReading: rememberLastReading ? current.lastReading : null,
      preferences: { ...current.preferences, rememberLastReading },
    }));
  }, []);

  const setDefaultBibleId = useCallback((defaultBibleId: string) => {
    setWorkspace((current) => ({
      ...current,
      preferences: { ...current.preferences, defaultBibleId },
    }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setWorkspace((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        reduceMotion: !current.preferences.reduceMotion,
      },
    }));
  }, []);

  const setLastReading = useCallback((lastReading: ReadingLocation) => {
    setWorkspace((current) => {
      if (!current.preferences.rememberLastReading) return current;
      const previous = current.lastReading;
      if (
        previous?.bibleId === lastReading.bibleId &&
        previous.bookId === lastReading.bookId &&
        previous.chapterId === lastReading.chapterId &&
        previous.chapterNumber === lastReading.chapterNumber
      ) {
        return current;
      }
      return { ...current, lastReading };
    });
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

  const resetReading = useCallback(() => {
    setWorkspace((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        readingScale: initialState.preferences.readingScale,
        readingLineHeight: initialState.preferences.readingLineHeight,
        readingWidth: initialState.preferences.readingWidth,
        readingFont: initialState.preferences.readingFont,
      },
    }));
  }, []);

  const clearStudyData = useCallback(() => {
    setWorkspace((current) => ({
      ...current,
      completedByStudy: {},
      bookmarks: [],
      notes: {},
      lastReading: null,
    }));
  }, []);

  const restoreWorkspace = useCallback((value: unknown) => {
    if (!isWorkspaceBackup(value)) return false;
    setWorkspace(normalizeWorkspace(value));
    return true;
  }, []);

  const resetWorkspace = useCallback(() => {
    setWorkspace(initialState);
  }, []);

  const resetAppearance = useCallback(() => {
    setWorkspace((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        colorPalette: initialState.preferences.colorPalette,
        colorMode: initialState.preferences.colorMode,
        highContrast: initialState.preferences.highContrast,
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
    setReadingLineHeight,
    setReadingWidth,
    setReadingFont,
    setRememberLastReading,
    setDefaultBibleId,
    toggleReduceMotion,
    setLastReading,
    toggleFocusMode,
    setColorPalette,
    setColorMode,
    toggleHighContrast,
    resetReading,
    resetAppearance,
    clearStudyData,
    restoreWorkspace,
    resetWorkspace,
  };
}
