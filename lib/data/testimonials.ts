export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: number;
  verified: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Entered on a Tuesday, had the keys by the weekend. The whole process was calm and professional.",
    name: "Rachel T.",
    location: "Sheffield",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "You can actually see how many entries are left before you pay. That transparency is why I keep coming back.",
    name: "Ade O.",
    location: "London",
    rating: 5,
    verified: true,
  },
  {
    quote:
      "Draw was streamed, my number came up, money was in my account the next morning. No drama.",
    name: "Kirsty M.",
    location: "Edinburgh",
    rating: 5,
    verified: true,
  },
];
