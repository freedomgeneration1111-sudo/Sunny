import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/sections/LegalPage";
import { socialMetadata } from "@/lib/seo";

const title = "Terms";
const description = "Terms for using the Focus Lab Productions website and submitting an event inquiry.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/terms/" },
  ...socialMetadata(title, description),
};

const sections: readonly LegalSection[] = [
  {
    title: "Using this website",
    paragraphs: [
      "You are welcome to browse this site, read the guides, and send us an inquiry. Please do not attempt to disrupt the site, submit automated or abusive traffic, or misuse the chat and inquiry forms.",
    ],
  },
  {
    title: "Information on this site",
    paragraphs: [
      "We keep the service and pricing information on this site current and accurate. Even so, information here is provided for reference — it describes what Focus Lab offers and where prices start.",
      "Nothing on this website is an offer that can be accepted by itself, and nothing here creates a booking.",
    ],
  },
  {
    title: "Pricing and quotes",
    paragraphs: [
      "Prices shown on the pricing page describe our current service menu. Your actual price depends on the real details of your event — the date, venue, hours, travel, guest count, and the services you choose.",
      "A quote is prepared by our team and shared with you directly. Until you have that quote, no price has been agreed.",
    ],
  },
  {
    title: "Inquiries do not book an event",
    paragraphs: [
      "Sending an inquiry through Check Availability, or starting a conversation in chat, tells us what you are planning so we can respond. It does not reserve your date and it does not book any service.",
    ],
    list: [
      "Your date is not held when you submit an inquiry.",
      "A booking exists only once Focus Lab and you have completed the company's booking process, including a signed agreement and any deposit it requires.",
      "Availability can change between your inquiry and your booking.",
    ],
  },
  {
    title: "Photography, video, and other services",
    paragraphs: [
      "What is included in your event — coverage hours, crew, equipment, deliverables, and timelines — is set out in your agreement with Focus Lab, not on this website.",
      "Some services depend on conditions at your venue. Effects such as sparks, low clouds, haze, and larger production or rigging require venue approval and safe operating conditions. We will tell you when something needs to be confirmed with your venue.",
    ],
  },
  {
    title: "Content on this site",
    paragraphs: [
      "The text, design, photography, and guides on this site belong to Focus Lab Productions. You are welcome to read, print, and share the planning guides for your own event. Please do not republish them as your own.",
    ],
  },
  {
    title: "Guides and planning material",
    paragraphs: [
      "Our planning guides are general professional guidance drawn from how events commonly run. They are not a substitute for your venue's rules, your contracts with other vendors, or advice specific to your event.",
    ],
  },
  {
    title: "Changes",
    paragraphs: [
      "We update this website as our services and pricing change. These terms may change with it, and the current version is always the one on this page.",
    ],
  },
  {
    title: "Questions",
    paragraphs: [
      "If anything here is unclear, ask us before you book. Get in touch through Check Availability or chat.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Using this site, and what happens next."
      intro="A plain summary of how this website works, what the pricing means, and the difference between sending an inquiry and booking an event."
      sections={sections}
    />
  );
}
