import { useEffect, useState } from "react";

export type AppointmentKind = "doctor" | "reminder";

export interface Appointment {
  id: string;
  title: string;
  kind: AppointmentKind;
  /** ISO date string yyyy-mm-dd */
  date: string;
  /** HH:mm (24h) */
  time: string;
  notes?: string;
  with?: string; // doctor / clinic name
}

const KEY = "nova:appointments";

export function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  if (raw) return JSON.parse(raw) as Appointment[];
  const today = new Date();
  const inDays = (d: number) => {
    const dt = new Date(today);
    dt.setDate(dt.getDate() + d);
    return dt.toISOString().slice(0, 10);
  };
  const seed: Appointment[] = [
    {
      id: "seed-1",
      title: "Menopause check-in",
      kind: "doctor",
      date: inDays(3),
      time: "10:30",
      with: "Dr. Amara Patel",
      notes: "Bring symptom log.",
    },
    {
      id: "seed-2",
      title: "Evening magnesium",
      kind: "reminder",
      date: inDays(0),
      time: "21:00",
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(seed));
  return seed;
}

export function saveAppointments(a: Appointment[]) {
  localStorage.setItem(KEY, JSON.stringify(a));
}

export function useAppointments() {
  const [items, setItems] = useState<Appointment[]>([]);
  useEffect(() => setItems(loadAppointments()), []);
  const add = (a: Omit<Appointment, "id">) => {
    const next = [{ ...a, id: crypto.randomUUID() }, ...items].sort(
      (x, y) => (x.date + x.time).localeCompare(y.date + y.time),
    );
    setItems(next);
    saveAppointments(next);
  };
  const remove = (id: string) => {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveAppointments(next);
  };
  return { items, add, remove };
}
