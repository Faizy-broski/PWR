import type { Metadata } from "next";
import { WinnersHero } from "@/components/pages/winners/winners-hero";
import { WinnersSection } from "@/components/pages/winners/winners-section";
import type { Winner } from "@/components/pages/winners/winners-card";
import { FeaturedWinnersSection } from "@/components/pages/winners/featured-winners-section";
import type { FeaturedWinner } from "@/components/pages/winners/featured-winners-card";
import { MoreWinnersSection } from "@/components/pages/winners/more-winners-section";

export const metadata: Metadata = {
  title: "All Winners",
  description: "",
};

// Replace with a real fetch (CMS / API) — sample data shown to match the layout.
const winners: Winner[] = [
  {
    id: "james-manchester",
    category: "Cars",
    name: "James",
    location: "Manchester",
    prizeName: "Porsche 911 Carrera",
    prizeValue: "£89,000 prize",
    image: "/winners/winner-1.png",
    imageAlt: "James from Manchester with his Porsche 911 Carrera",
    href: "/winners/james-manchester",
  },
  {
    id: "denise-cardiff",
    category: "Cash",
    name: "Denise",
    location: "Cardiff",
    prizeName: "£100,000 Tax-Free Cash",
    prizeValue: "£100,000 prize",
    image: "/winners/winner-2.png",
    imageAlt: "Denise from Cardiff with her red Porsche",
    href: "/winners/denise-cardiff",
  },
  {
    id: "hartleys-york",
    category: "Homes",
    name: "The Hartleys",
    location: "York",
    prizeName: "Four-Bedroom Family Home",
    prizeValue: "£420,000 prize",
    image: "/winners/winner-3.png",
    imageAlt: "The Hartleys family from York with their new SUV",
    href: "/winners/hartleys-york",
  },
  {
    id: "tom-ellie-bristol",
    category: "Cars",
    name: "Tom & Ellie",
    location: "Bristol",
    prizeName: "Audi RS 5 Sportback",
    prizeValue: "£68,000 prize",
    image: "/winners/winner-4.png",
    imageAlt: "Tom & Ellie from Bristol celebrating outside their new home",
    href: "/winners/tom-ellie-bristol",
  },
  {
    id: "raymond-newcastle",
    category: "Cash",
    name: "Raymond",
    location: "Newcastle",
    prizeName: "£25,000 Cash",
    prizeValue: "£25,000 prize",
    image: "/winners/winner-5.png",
    imageAlt: "Raymond's £1.2M Devon home winner announcement",
    href: "/winners/raymond-newcastle",
  },
  {
    id: "hannah-inverness",
    category: "Cars",
    name: "Hannah",
    location: "Inverness",
    prizeName: "Ford Mustang GT",
    prizeValue: "£54,000 prize",
    image: "/winners/winner-6.png",
    imageAlt: "Hannah from Inverness celebrating her Ford Mustang GT win",
    href: "/winners/hannah-inverness",
  },
];

const featuredWinners: FeaturedWinner[] = [
  {
    id: "sarah-birmingham",
    name: "Sarah",
    location: "Birmingham",
    prizeName: "Range Rover",
    prizeValue: "£75,000 prize",
    quote:
      "I couldn't believe it when I realised I'd actually won. It still doesn't feel real.",
    image: "/winners/sarah-brimingham.png",
    imageAlt: "Sarah from Birmingham, visibly emotional, standing beside her new Range Rover",
    href: "/winners/sarah-birmingham",
  },
];

export default async function WinnersPage() {
  return (
    <div className="min-h-screen bg-[#0D0C0C] -mt-18 pt-32 sm:-mt-20 sm:pt-36 lg:-mt-24 lg:pt-40">
      <WinnersHero />
      <WinnersSection winners={winners} />
      <FeaturedWinnersSection winners={featuredWinners} />
      <MoreWinnersSection winners={winners} />
    </div>
  );
}