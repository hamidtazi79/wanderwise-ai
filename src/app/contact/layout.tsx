import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us – Wanderwise AI",
  description: "Get in touch with the Wanderwise AI team for support, feedback, or inquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
