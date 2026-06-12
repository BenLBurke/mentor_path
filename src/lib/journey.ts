import { Journey } from "./types";

const JOURNEY_KEY = "mentorpath_journey";
const PROGRESS_KEY = "mentorpath_journey_progress";

export function loadJourney(): Journey | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(JOURNEY_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Journey;
  } catch {
    return null;
  }
}

export function saveJourney(journey: Journey): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(journey));
}

export function clearJourney(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(JOURNEY_KEY);
  localStorage.removeItem(PROGRESS_KEY);
}

export function loadProgress(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function saveProgress(completedIds: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(completedIds));
}
