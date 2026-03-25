// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto max-w-2xl py-20">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Contact Wanderwise AI
      </h1>

      <p className="text-center text-muted-foreground mb-10">
        Have questions, feedback, or need help?  
        We’d love to hear from you.
      </p>

      {/* Contact Info Section */}
      <div className="bg-card border rounded-xl p-6 mb-10 shadow">
        <h2 className="text-xl font-semibold mb-2">Email Us</h2>
        <p className="text-muted-foreground">
          You can reach us anytime at:  
          <br />
          <a
            href="mailto:contact@wanderwise.uk"
            className="text-primary font-medium underline"
          >
            contact@wanderwise.uk
          </a>
        </p>
      </div>

      {/* Contact Form (Optional) */}
      {!submitted ? (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div>
            <label className="block text-sm mb-1 font-medium">Your Name</label>
            <input
              type="text"
              required
              className="w-full p-3 border rounded-md bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Your Email</label>
            <input
              type="email"
              required
              className="w-full p-3 border rounded-md bg-background"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 font-medium">Your Message</label>
            <textarea
              required
              rows={5}
              className="w-full p-3 border rounded-md bg-background"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
          >
            Send Message
          </button>
        </form>
      ) : (
        <div className="text-center p-6 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
          <p>Thank you for reaching out. We’ll get back to you soon.</p>
        </div>
      )}

      <div className="text-center mt-10">
        <Link href="/" className="text-primary underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
