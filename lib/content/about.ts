import { config } from "@/lib/config";

export const aboutHero = {
  eyebrow: "About the Team",
  h1: "A new name for an experienced team.",
  subhead: `${config.businessName} brings photographers, filmmakers, DJs and event professionals together under one DFW company, with real experience in South Asian celebrations and a practical understanding of live events.`,
};

export const disciplines = {
  h2: "Different disciplines. One standard: pay attention.",
  body: `The camera operator is watching a different part of the room than the DJ. The lighting operator is solving a different problem than the filmmaker. Good event work depends on each person knowing their craft — and understanding what everyone else is trying to accomplish. That is the kind of team we are building under ${config.businessName}.`,
};

export const teamBlock = {
  heading: "Meet the people behind the work.",
  body: "Individual bios, specialties and documented years of experience will be added here as the founder dossier is completed.",
  requiredFields: [
    "Name",
    "Role",
    "Specialty",
    "Relevant experience",
    "South Asian event experience where applicable",
    "Portrait",
  ],
  roles: [
    "Founder / Lead",
    "Photography",
    "Film",
    "DJ & MC",
    "Lighting & Effects",
    "Social Content",
  ],
};

export const dfwSection = {
  h2: "Based in DFW. Built for live events.",
  body: "Weddings, parties, cultural celebrations and organization events all ask something different from a crew. Our job is to understand the room before we start choosing what belongs in it.",
};

export const aboutFinalCta = {
  h2: "Tell us what you're planning.",
  cta: "Check Availability",
};
