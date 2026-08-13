export interface Winner {
  name: string;
  location: string;
  prizeLabel: string;
  drawName: string;
  wonAt: string;
}

export const winners: Winner[] = [
  {
    name: "James",
    location: "Manchester",
    prizeLabel: "£25,000 Cash",
    drawName: "Summer Cash Draw",
    wonAt: "2026-08-02",
  },
  {
    name: "Sarah",
    location: "Leeds",
    prizeLabel: "Gaming Bundle",
    drawName: "Ultimate Battlestation",
    wonAt: "2026-07-29",
  },
  {
    name: "Michael",
    location: "Cardiff",
    prizeLabel: "Performance Coupé",
    drawName: "GT Coupé Draw",
    wonAt: "2026-07-21",
  },
  {
    name: "Emma",
    location: "Glasgow",
    prizeLabel: "Luxury Holiday",
    drawName: "Villa Escape",
    wonAt: "2026-07-14",
  },
  {
    name: "Daniel",
    location: "Bristol",
    prizeLabel: "£10,000 Cash",
    drawName: "Midweek Cash",
    wonAt: "2026-07-09",
  },
  {
    name: "Priya",
    location: "Birmingham",
    prizeLabel: "Gold Chronograph",
    drawName: "Timepiece Draw",
    wonAt: "2026-07-01",
  },
];
