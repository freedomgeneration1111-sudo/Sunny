import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Focus Lab Productions handles the information you share through this website.",
  alternates: { canonical: "/privacy/" },
};

const sections: readonly LegalSection[] = [
  {
    title: "What this covers",
    paragraphs: [
      "This page explains what information the Focus Lab Productions website collects and what we do with it. It applies to this website. It does not cover information you share with us some other way, such as a phone call or a signed agreement.",
    ],
  },
  {
    title: "Information you give us",
    paragraphs: [
      "You only share information with us if you choose to. There are two places on this site where that happens:",
    ],
    list: [
      "Check Availability — the event details and contact details you enter, such as your name, email address, phone number, event type, date, venue or city, guest count, and any notes you add.",
      "Chat — your name, email address, an optional phone number, and the messages you send us.",
    ],
  },
  {
    title: "Information collected automatically",
    paragraphs: [
      "Like most websites, ours records basic technical information when you visit — things like your browser type, device type, approximate location from your IP address, and which pages you looked at. This is ordinary operational data used to keep the site working and secure.",
      "We use a bot-protection check on the inquiry form to prevent automated spam submissions. This is provided by Cloudflare and works without identifying you personally.",
    ],
  },
  {
    title: "How we use it",
    list: [
      "To respond to your inquiry and prepare a quote.",
      "To continue a conversation you started, including by email if you ask us to.",
      "To keep a record of the events we are planning and the ones we have booked.",
      "To keep the website running, secure, and free of automated abuse.",
    ],
  },
  {
    title: "Who else sees it",
    paragraphs: [
      "We do not sell your information, and we do not share it for advertising.",
      "Your information is stored on infrastructure operated by Cloudflare, which hosts this website and our systems. If we ever need another service provider to deliver something you have asked for, they only receive what is needed for that purpose.",
      "We may share information if the law requires it.",
    ],
  },
  {
    title: "How long we keep it",
    paragraphs: [
      "We keep inquiry and conversation records for as long as they are useful for planning your event and for our ordinary business records. If you would like us to delete your information, ask and we will.",
    ],
  },
  {
    title: "Your choices",
    list: [
      "You can ask what information we hold about you.",
      "You can ask us to correct it.",
      "You can ask us to delete it.",
      "You can decide not to use the inquiry form or chat at all, and contact us another way.",
    ],
  },
  {
    title: "Children",
    paragraphs: [
      "This website is intended for adults planning events. It is not directed at children, and we do not knowingly collect information from them.",
    ],
  },
  {
    title: "Changes",
    paragraphs: [
      "If we change how the website handles information, we will update this page.",
    ],
  },
  {
    title: "Questions",
    paragraphs: [
      "If you have a question about anything on this page, get in touch through Check Availability or chat and ask us directly.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="What we collect, and why."
      intro="Focus Lab Productions collects only what it needs to answer your inquiry and plan your event. Here is exactly what that means on this website."
      sections={sections}
    />
  );
}
