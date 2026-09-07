import { describe, it, expect, vi, afterEach } from "vitest";
import { competitionStatusPill, formatCountdown } from "./competition-status";
import type { Competition } from "@/lib/types";

function makeCompetition(overrides: Partial<Competition>): Competition {
  return {
    id: "1",
    slug: "test",
    title: "Test",
    description: "",
    category: "free",
    prizeValue: 100,
    ticketPrice: 0,
    totalTickets: 10,
    ticketsSold: 0,
    status: "live",
    images: [],
    startsAt: new Date().toISOString(),
    closesAt: new Date().toISOString(),
    drawnAt: null,
    winnerEntryId: null,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("competitionStatusPill", () => {
  it("shows Live for a live competition with tickets remaining", () => {
    const pill = competitionStatusPill(
      makeCompetition({ status: "live", ticketsSold: 5, totalTickets: 10 }),
    );
    expect(pill).toEqual({ tone: "warm", label: "Live" });
  });

  it("shows Sold out for a live competition with no tickets remaining", () => {
    const pill = competitionStatusPill(
      makeCompetition({ status: "live", ticketsSold: 10, totalTickets: 10 }),
    );
    expect(pill).toEqual({ tone: "dark", label: "Sold out" });
  });

  it("shows Draft/Closed/Drawn for the other statuses", () => {
    expect(competitionStatusPill(makeCompetition({ status: "draft" }))).toEqual({
      tone: "muted",
      label: "Draft",
    });
    expect(competitionStatusPill(makeCompetition({ status: "closed" }))).toEqual({
      tone: "dark",
      label: "Closed",
    });
    expect(competitionStatusPill(makeCompetition({ status: "drawn" }))).toEqual({
      tone: "dark",
      label: "Drawn",
    });
  });
});

describe("formatCountdown", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an em dash once closesAt has passed", () => {
    expect(formatCountdown(new Date(Date.now() - 1000).toISOString())).toBe(
      "—",
    );
  });

  it("formats the remaining time as days and hours", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
    const closesAt = new Date("2026-01-03T05:00:00.000Z").toISOString();
    expect(formatCountdown(closesAt)).toBe("2D 5H");
  });
});
