// Availability model — derives per-day status for an artist.
//
// Rules (from client brief):
//   • Green  = whole day free
//   • Yellow = ≥1 active booking or artist-scheduled event that day
//   • Red    = date is explicitly blocked OR considered fully booked (≥3 slots taken)
//
// Why 3 for "fully booked": one artist typically takes 2–3 bookings a day
// (morning / afternoon / evening). Tweak FULL_DAY_LIMIT if the business rule changes.

export const FULL_DAY_LIMIT = 3;

export type DayStatus = "green" | "yellow" | "red";

export type AvailabilityInput = {
  // YYYY-MM-DD for all keys
  bookingsByDay: Record<string, number>;   // count of pending/accepted bookings
  eventsByDay: Record<string, number>;     // count of artist-scheduled events
  blockedDays: Set<string>;                // dates the artist explicitly blocked
};

export function statusForDay(day: string, input: AvailabilityInput): DayStatus {
  if (input.blockedDays.has(day)) return "red";
  const occupied = (input.bookingsByDay[day] ?? 0) + (input.eventsByDay[day] ?? 0);
  if (occupied >= FULL_DAY_LIMIT) return "red";
  if (occupied >= 1) return "yellow";
  return "green";
}

export function isoDay(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isUnbookable(day: string, input: AvailabilityInput): boolean {
  return statusForDay(day, input) === "red";
}

// Given raw rows from Supabase, fold them into the aggregate shape used above.
export function buildAvailability(
  bookings: { date: string; status: string }[],
  events: { event_date: string }[],
  blocks: { blocked_date: string }[]
): AvailabilityInput {
  const bookingsByDay: Record<string, number> = {};
  for (const b of bookings) {
    if (b.status === "cancelled" || b.status === "rejected") continue;
    const key = isoDay(b.date);
    bookingsByDay[key] = (bookingsByDay[key] ?? 0) + 1;
  }
  const eventsByDay: Record<string, number> = {};
  for (const e of events) {
    eventsByDay[e.event_date] = (eventsByDay[e.event_date] ?? 0) + 1;
  }
  const blockedDays = new Set(blocks.map((b) => b.blocked_date));
  return { bookingsByDay, eventsByDay, blockedDays };
}
