"use client";

import { useCallback, useEffect, useState } from "react";

import {
  isColorMode,
  isColorPalette,
  resolveColorMode,
  type ColorMode,
  type ColorPalette,
} from "@/lib/theme-palettes";

import {
  initialWorkspaceState as initialState,
  isWorkspaceBackup,
  normalizeWorkspace,
  type ReadingFont,
  type ReadingLineHeight,
  type ReadingLocation,
  type ReadingScale,
  type ReadingWidth,
} from "@/lib/study-workspace";

export type {
  ReadingFont,
  ReadingLineHeight,
  ReadingLocation,
  ReadingScale,
  ReadingWidth,
} from "@/lib/study-workspace";

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
