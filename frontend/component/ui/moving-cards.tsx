"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-black items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Resolve AI helped me clear my biggest JEE doubts in minutes. The AI tutor explained concepts I struggled with for weeks in a way that finally clicked. My physics score improved by 30 marks!",
    name: "Arjun Sharma",
    title: "JEE Main 2025 - AIR 1250",
  },
  {
    quote:
      "The personalized study plans are a game-changer. Instead of wasting time on topics I already know, Resolve AI focused me on my weak areas. Got into IIT Delhi because of this!",
    name: "Priya Patel",
    title: "JEE Advanced 2025 - AIR 850",
  },
  {
    quote: "Organic chemistry used to be my nightmare. The AI mentor broke down reaction mechanisms so simply that I actually started enjoying the subject. From 40% to 85% in 3 months.",
    name: "Rohan Kumar",
    title: "JEE Main 2025 - AIR 2100",
  },
  {
    quote:
      "The instant doubt solving on WhatsApp saved me countless hours. No more waiting for teachers or scrolling through forums. Got my calculus doubts cleared at 2 AM!",
    name: "Sneha Gupta",
    title: "JEE Main 2025 - AIR 980",
  },
  {
    quote:
      "PYQ recommendations were spot-on. Instead of solving random questions, I focused on the exact pattern that appears in JEE. The AI knew exactly what I needed to practice.",
    name: "Vikram Singh",
    title: "JEE Advanced 2025 - AIR 650",
  },
  {
    quote:
      "The progress tracking kept me motivated. Seeing my weak chapters improve week by week made all the hard work feel worth it. Finally cracked JEE after 2 attempts!",
    name: "Ananya Reddy",
    title: "JEE Main 2025 - AIR 750",
  },
];
