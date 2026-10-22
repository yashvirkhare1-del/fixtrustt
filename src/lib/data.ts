export type Category = { slug: string; name: string; blurb: string };

export const categories: Category[] = [
  { slug: "appliance", name: "Appliance repair", blurb: "Washers, fridges, ovens" },
  { slug: "electrical", name: "Electrical work", blurb: "Wiring, switches, fittings" },
  { slug: "plumbing", name: "Plumbing", blurb: "Leaks, taps, drainage" },
  { slug: "electronics", name: "Electronics", blurb: "TVs, laptops, audio" },
  { slug: "carpentry", name: "Carpentry", blurb: "Doors, furniture, shelving" },
  { slug: "installation", name: "Installation", blurb: "ACs, geysers, mounts" },
];

export type EstimateLine = { item: string; price: number };
export type Technician = {
  id: string;
  name: string;
  initials: string;
  category: string;
  area: string;
  years: number;
  rating: number;
  reviews: number;
  jobs: number;
  visitCharge: number;
  skills: string[];
  bio: string;
  estimate: EstimateLine[];
  testimonials: { who: string; text: string }[];
};

export const technicians: Technician[] = [
  {
    id: "arjun-mehta", name: "Arjun Mehta", initials: "AM", category: "appliance", area: "Andheri, Mumbai",
    years: 9, rating: 4.9, reviews: 212, jobs: 640, visitCharge: 299,
    skills: ["Washing machines", "Refrigerators", "Microwaves"],
    bio: "Specialist in front-load washers and inverter fridges. Explains every fault before starting work.",
    estimate: [{ item: "Inspection visit", price: 299 }, { item: "Drain pump replacement", price: 1450 }, { item: "Labour", price: 400 }],
    testimonials: [{ who: "Sample review", text: "Showed me the faulty part and the price before replacing it." }],
  },
  {
    id: "priya-nair", name: "Priya Nair", initials: "PN", category: "electrical", area: "Indiranagar, Bengaluru",
    years: 7, rating: 4.8, reviews: 168, jobs: 510, visitCharge: 249,
    skills: ["House wiring", "MCB panels", "Lighting"],
    bio: "Certified electrician focused on safe, code-compliant home wiring and fittings.",
    estimate: [{ item: "Inspection visit", price: 249 }, { item: "MCB replacement", price: 650 }, { item: "Labour", price: 300 }],
    testimonials: [{ who: "Sample review", text: "Neat, careful work and a clear written estimate." }],
  },
  {
    id: "rahul-verma", name: "Rahul Verma", initials: "RV", category: "plumbing", area: "Kothrud, Pune",
    years: 12, rating: 4.7, reviews: 301, jobs: 980, visitCharge: 199,
    skills: ["Leak repair", "Bathroom fittings", "Drain cleaning"],
    bio: "Twelve years fixing leaks and fittings. Known for showing up exactly on time.",
    estimate: [{ item: "Inspection visit", price: 199 }, { item: "Cartridge tap replacement", price: 850 }, { item: "Labour", price: 250 }],
    testimonials: [{ who: "Sample review", text: "Fixed a leak two others couldn't find." }],
  },
  {
    id: "sana-khan", name: "Sana Khan", initials: "SK", category: "electronics", area: "Saket, Delhi",
    years: 6, rating: 4.9, reviews: 143, jobs: 420, visitCharge: 349,
    skills: ["LED TVs", "Laptops", "Home audio"],
    bio: "Board-level electronics repair with a 90-day workmanship guarantee.",
    estimate: [{ item: "Diagnosis", price: 349 }, { item: "TV backlight strip", price: 1800 }, { item: "Labour", price: 500 }],
    testimonials: [{ who: "Sample review", text: "Saved my TV when the shop said replace it." }],
  },
  {
    id: "vikram-singh", name: "Vikram Singh", initials: "VS", category: "carpentry", area: "Salt Lake, Kolkata",
    years: 15, rating: 4.8, reviews: 189, jobs: 720, visitCharge: 249,
    skills: ["Door repair", "Modular furniture", "Shelving"],
    bio: "Third-generation carpenter. Repairs before replacing, always.",
    estimate: [{ item: "Inspection visit", price: 249 }, { item: "Hinge & alignment fix", price: 600 }, { item: "Labour", price: 350 }],
    testimonials: [{ who: "Sample review", text: "Doors close perfectly now. Fair price." }],
  },
  {
    id: "meera-iyer", name: "Meera Iyer", initials: "MI", category: "installation", area: "Adyar, Chennai",
    years: 8, rating: 4.7, reviews: 156, jobs: 560, visitCharge: 299,
    skills: ["Split AC", "Water heaters", "TV mounting"],
    bio: "Clean, careful installations with a full checklist handed over after each job.",
    estimate: [{ item: "Site visit", price: 299 }, { item: "Split AC installation", price: 1500 }, { item: "Copper pipe (3m)", price: 900 }],
    testimonials: [{ who: "Sample review", text: "Left the room cleaner than she found it." }],
  },
];

export const categoryName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
export const getTech = (id: string) => technicians.find((t) => t.id === id);
export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const estimateTotal = (t: Technician) => t.estimate.reduce((s, l) => s + l.price, 0);

export const repairs = [
  { appliance: "Washing machine", brand: "Front-load, 7kg", date: "12 Aug 2026", tech: "Arjun Mehta", work: "Drain pump replaced", cost: 2149, status: "Completed", warranty: "Until Nov 2026" },
  { appliance: "Kitchen tap", brand: "Single-lever mixer", date: "28 Jun 2026", tech: "Rahul Verma", work: "Cartridge replaced", cost: 1299, status: "Completed", warranty: "Until Sep 2026" },
  { appliance: "Split AC", brand: "1.5 ton inverter", date: "Upcoming · 30 Oct 2026", tech: "Meera Iyer", work: "Annual service", cost: 799, status: "Scheduled", warranty: "—" },
];
