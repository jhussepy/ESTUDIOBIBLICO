import type { ReadingLocation } from "./study-workspace";

interface StartupReadingInput {
  initialLocationIsExplicit: boolean;
  rememberLastReading: boolean;
  lastReading: ReadingLocation | null;
}

interface RememberedBibleInput extends StartupReadingInput {
  requestedBibleId: string;
}

interface RememberedReadingInput extends StartupReadingInput {
  requestedBookId: string;
  selectedBibleId: string;
}

export function getRememberedBibleId({
  requestedBibleId,
  initialLocationIsExplicit,
  rememberLastReading,
  lastReading,
}: RememberedBibleInput) {
  if (requestedBibleId || initialLocationIsExplicit || !rememberLastReading) return "";
  return lastReading?.bibleId || "";
}

export function getRememberedReading({
  requestedBookId,
  selectedBibleId,
  initialLocationIsExplicit,
  rememberLastReading,
  lastReading,
}: RememberedReadingInput): ReadingLocation | null {
  if (requestedBookId || initialLocationIsExplicit || !rememberLastReading) return null;
  return lastReading?.bibleId === selectedBibleId ? lastReading : null;
}
