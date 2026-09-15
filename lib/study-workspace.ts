import {
  isColorMode,
  isColorPalette,
  type ColorMode,
  type ColorPalette,
} from "./theme-palettes";

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

export interface StudyPreferences {
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
}

export interface StudyWorkspaceState {
  version: 1;
  completedByStudy: Record<string, number[]>;
  bookmarks: string[];
  notes: Record<string, string>;
  lastReading: ReadingLocation | null;
  preferences: StudyPreferences;
}

export const initialWorkspaceState: StudyWorkspaceState = {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isReadingScale(value: unknown): value is ReadingScale {
  return value === "small" || value === "normal" || value === "large" || value === "extra-large";
}

function isReadingLineHeight(value: unknown): value is ReadingLineHeight {
  return value === "compact" || value === "comfortable" || value === "spacious";
}

function isReadingWidth(value: unknown): value is ReadingWidth {
  return value === "narrow" || value === "balanced" || value === "wide";
}

function isReadingFont(value: unknown): value is ReadingFont {
  return value === "serif" || value === "accessible";
}

function isReadingLocation(value: unknown): value is ReadingLocation {
  if (!isRecord(value)) return false;
  return (
    typeof value.bibleId === "string" &&
    value.bibleId.length > 0 &&
    typeof value.bookId === "string" &&
    value.bookId.length > 0 &&
    typeof value.chapterId === "string" &&
    value.chapterId.length > 0 &&
    Number.isInteger(value.chapterNumber) &&
    (value.chapterNumber as number) > 0
  );
}

function normalizeReadingLocation(value: unknown): ReadingLocation | null {
  if (!isReadingLocation(value)) return null;
  return {
    bibleId: value.bibleId,
    bookId: value.bookId,
    chapterId: value.chapterId,
    chapterNumber: value.chapterNumber,
  };
}

export function isWorkspaceBackup(value: unknown): value is StudyWorkspaceState {
  if (!isRecord(value) || value.version !== 1) return false;
  if (!isRecord(value.completedByStudy) || !isRecord(value.notes)) return false;
  if (!Array.isArray(value.bookmarks) || !value.bookmarks.every((item) => typeof item === "string")) {
    return false;
  }
  if (
    !Object.entries(value.completedByStudy).every(
      ([key, verses]) =>
        key.length > 0 &&
        Array.isArray(verses) &&
        verses.every((verse) => Number.isInteger(verse) && verse > 0),
    )
  ) {
    return false;
  }
  if (!Object.values(value.notes).every((note) => typeof note === "string")) return false;
  if (value.lastReading !== null && !isReadingLocation(value.lastReading)) return false;
  if (!isRecord(value.preferences)) return false;

  const preferences = value.preferences;
  return (
    isReadingScale(preferences.readingScale) &&
    isReadingLineHeight(preferences.readingLineHeight) &&
    isReadingWidth(preferences.readingWidth) &&
    isReadingFont(preferences.readingFont) &&
    typeof preferences.focusMode === "boolean" &&
    typeof preferences.rememberLastReading === "boolean" &&
    typeof preferences.defaultBibleId === "string" &&
    typeof preferences.reduceMotion === "boolean" &&
    isColorPalette(preferences.colorPalette) &&
    isColorMode(preferences.colorMode) &&
    typeof preferences.highContrast === "boolean"
  );
}

export function normalizeWorkspace(value: unknown): StudyWorkspaceState {
  if (!isRecord(value)) return initialWorkspaceState;
  const preferences = isRecord(value.preferences) ? value.preferences : {};

  return {
    version: 1,
    completedByStudy: isRecord(value.completedByStudy)
      ? Object.fromEntries(
          Object.entries(value.completedByStudy)
            .filter((entry): entry is [string, unknown[]] => Array.isArray(entry[1]))
            .map(([key, verses]) => [
              key,
              [
                ...new Set(
                  verses.filter(
                    (verse): verse is number => Number.isInteger(verse) && (verse as number) > 0,
                  ),
                ),
              ],
            ]),
        )
      : {},
    bookmarks: Array.isArray(value.bookmarks)
      ? value.bookmarks.filter((item): item is string => typeof item === "string")
      : [],
    notes: isRecord(value.notes)
      ? Object.fromEntries(
          Object.entries(value.notes).filter(
            (entry): entry is [string, string] => typeof entry[1] === "string",
          ),
        )
      : {},
    lastReading: normalizeReadingLocation(value.lastReading),
    preferences: {
      readingScale: isReadingScale(preferences.readingScale)
        ? preferences.readingScale
        : initialWorkspaceState.preferences.readingScale,
      readingLineHeight: isReadingLineHeight(preferences.readingLineHeight)
        ? preferences.readingLineHeight
        : initialWorkspaceState.preferences.readingLineHeight,
      readingWidth: isReadingWidth(preferences.readingWidth)
        ? preferences.readingWidth
        : initialWorkspaceState.preferences.readingWidth,
      readingFont: isReadingFont(preferences.readingFont)
        ? preferences.readingFont
        : initialWorkspaceState.preferences.readingFont,
      focusMode: Boolean(preferences.focusMode),
      rememberLastReading:
        typeof preferences.rememberLastReading === "boolean"
          ? preferences.rememberLastReading
          : initialWorkspaceState.preferences.rememberLastReading,
      defaultBibleId:
        typeof preferences.defaultBibleId === "string"
          ? preferences.defaultBibleId
          : initialWorkspaceState.preferences.defaultBibleId,
      reduceMotion: Boolean(preferences.reduceMotion),
      colorPalette: isColorPalette(preferences.colorPalette)
        ? preferences.colorPalette
        : initialWorkspaceState.preferences.colorPalette,
      colorMode: isColorMode(preferences.colorMode)
        ? preferences.colorMode
        : initialWorkspaceState.preferences.colorMode,
      highContrast: Boolean(preferences.highContrast),
    },
  };
}
