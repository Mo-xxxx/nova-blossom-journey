import { useEffect, useState } from "react";

export type WristbandSize = "S" | "M" | "L";
export type Emotion = "calm" | "stressed" | "anxious";

export interface Profile {
  name: string;
  age: number;
  wristbandSize: WristbandSize;
  calibrated: boolean;
  onboarded: boolean;
}

export interface Episode {
  id: string;
  timestamp: number;
  type: "hot_flash" | "manual";
  intensity: number; // 1-5
  note?: string;
  duration?: number; // minutes
}

const PROFILE_KEY = "nova:profile";
const EPISODES_KEY = "nova:episodes";

export function loadProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as Profile) : null;
}
export function saveProfile(p: Profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
export function loadEpisodes(): Episode[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(EPISODES_KEY);
  if (raw) return JSON.parse(raw) as Episode[];
  // seed
  const now = Date.now();
  const seed: Episode[] = Array.from({ length: 14 }).map((_, i) => ({
    id: `seed-${i}`,
    timestamp: now - i * 1000 * 60 * 60 * (6 + (i % 5)),
    type: i % 3 === 0 ? "manual" : "hot_flash",
    intensity: 1 + ((i * 2) % 5),
    duration: 2 + (i % 6),
    note: i % 3 === 0 ? "Night sweats woke me." : undefined,
  }));
  localStorage.setItem(EPISODES_KEY, JSON.stringify(seed));
  return seed;
}
export function saveEpisodes(e: Episode[]) {
  localStorage.setItem(EPISODES_KEY, JSON.stringify(e));
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => setProfile(loadProfile()), []);
  return {
    profile,
    setProfile: (p: Profile) => {
      saveProfile(p);
      setProfile(p);
    },
  };
}

export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  useEffect(() => setEpisodes(loadEpisodes()), []);
  const add = (e: Omit<Episode, "id">) => {
    const next = [{ ...e, id: crypto.randomUUID() }, ...episodes];
    setEpisodes(next);
    saveEpisodes(next);
  };
  return { episodes, add };
}
