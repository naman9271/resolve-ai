"use client";

import React from "react";
import { TwoRowMovingCards, Testimonial } from "./infinite-moving-cards";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";

export function InfiniteMovingCardsDemo() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const bgColor = theme === "dark" ? "bg-black" : "bg-cream-50";

  // Use translations for testimonials
  const localizedTestimonials: Testimonial[] = t.testimonials?.items || testimonials;

  return (
    <div className={`rounded-md flex flex-col antialiased ${bgColor} items-center justify-center relative overflow-hidden py-8`}>
      <TwoRowMovingCards
        items={localizedTestimonials}
        speed="slow"
      />
    </div>
  );
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Resolve AI helped me clear my biggest JEE doubts in minutes. The AI tutor explained concepts I struggled with for weeks in a way that finally clicked. My physics score improved by 30 marks!",
    name: "Arjun Sharma",
    title: "JEE Main 2025 - AIR 1250",
    rating: 5,
  },
  {
    quote:
      "The personalized study plans are a game-changer. Instead of wasting time on topics I already know, Resolve AI focused me on my weak areas. Got into IIT Delhi because of this!",
    name: "Priya Patel",
    title: "JEE Advanced 2025 - AIR 850",
    rating: 5,
  },
  {
    quote: "Organic chemistry used to be my nightmare. The AI mentor broke down reaction mechanisms so simply that I actually started enjoying the subject. From 40% to 85% in 3 months.",
    name: "Rohan Kumar",
    title: "JEE Main 2025 - AIR 2100",
    rating: 5,
  },
  {
    quote:
      "The instant doubt solving on WhatsApp saved me countless hours. No more waiting for teachers or scrolling through forums. Got my calculus doubts cleared at 2 AM!",
    name: "Sneha Gupta",
    title: "JEE Main 2025 - AIR 980",
    rating: 5,
  },
  {
    quote:
      "PYQ recommendations were spot-on. Instead of solving random questions, I focused on the exact pattern that appears in JEE. The AI knew exactly what I needed to practice.",
    name: "Vikram Singh",
    title: "JEE Advanced 2025 - AIR 650",
    rating: 5,
  },
  {
    quote:
      "The progress tracking kept me motivated. Seeing my weak chapters improve week by week made all the hard work feel worth it. Finally cracked JEE after 2 attempts!",
    name: "Ananya Reddy",
    title: "JEE Main 2025 - AIR 750",
    rating: 5,
  },
  {
    quote:
      "The AI mentor understood my learning style and adapted explanations accordingly. Complex concepts in thermodynamics became so much clearer. Scored 95+ in Physics!",
    name: "Aditya Mehta",
    title: "JEE Advanced 2025 - AIR 420",
    rating: 5,
  },
  {
    quote:
      "Group study sessions on Resolve AI helped me stay accountable. Studying with peers and solving problems together made preparation less stressful and more fun!",
    name: "Kavya Nair",
    title: "JEE Main 2025 - AIR 1500",
    rating: 5,
  },
  {
    quote:
      "The chapter-wise PYQ analysis showed me exactly which topics are important. No more guessing what to study - the AI guided me perfectly through the syllabus.",
    name: "Rahul Verma",
    title: "JEE Advanced 2025 - AIR 780",
    rating: 5,
  },
  {
    quote:
      "From struggling with coordinate geometry to scoring full marks in it! The step-by-step solutions and practice problems were exactly what I needed.",
    name: "Ishita Singh",
    title: "JEE Main 2025 - AIR 550",
    rating: 5,
  },
  {
    quote:
      "The smart timetable feature helped me balance school and JEE prep perfectly. No more burnout - just consistent, focused studying every day.",
    name: "Aryan Joshi",
    title: "JEE Advanced 2025 - AIR 320",
    rating: 5,
  },
  {
    quote:
      "Inorganic chemistry tables and reactions were my weakness. The AI's memory techniques and pattern recognition helped me remember everything for the exam!",
    name: "Diya Sharma",
    title: "JEE Main 2025 - AIR 890",
    rating: 5,
  },
  {
    quote:
      "I was skeptical about AI tutoring at first, but Resolve AI proved me wrong. The detailed explanations for complex mechanics problems were better than my coaching classes!",
    name: "Karthik Iyer",
    title: "JEE Advanced 2025 - AIR 520",
    rating: 5,
  },
  {
    quote:
      "The mock test analysis feature helped me identify my mistakes. I improved my time management significantly and increased my score by 50 marks in just 2 months.",
    name: "Meera Jain",
    title: "JEE Main 2025 - AIR 620",
    rating: 5,
  },
  {
    quote:
      "Physical chemistry calculations were my weak point. The AI mentor's approach of breaking down problems into smaller steps made everything click. Scored 95 percentile!",
    name: "Siddharth Rao",
    title: "JEE Main 2025 - AIR 1100",
    rating: 5,
  },
  {
    quote:
      "The best part is getting doubts solved instantly at any time. Late-night study sessions became so productive with Resolve AI by my side!",
    name: "Pooja Krishnan",
    title: "JEE Advanced 2025 - AIR 680",
    rating: 5,
  },
  {
    quote:
      "Integration and differentiation were nightmares for me. The AI's visual explanations and practice problems transformed my understanding completely.",
    name: "Harsh Pandey",
    title: "JEE Main 2025 - AIR 420",
    rating: 5,
  },
  {
    quote:
      "As a dropper, I needed focused guidance. Resolve AI's personalized study plan helped me cover the entire syllabus efficiently and crack JEE on my second attempt!",
    name: "Tanvi Agarwal",
    title: "JEE Advanced 2025 - AIR 590",
    rating: 5,
  },
  {
    quote:
      "The habit tracker kept me consistent throughout my preparation. Building daily study habits was the key to my success in JEE!",
    name: "Aman Bhatt",
    title: "JEE Main 2025 - AIR 380",
    rating: 5,
  },
  {
    quote:
      "From being an average student to securing a seat at IIT Bombay - Resolve AI made this journey possible. The AI mentor felt like having a personal JEE coach 24/7!",
    name: "Nisha Kapoor",
    title: "JEE Advanced 2025 - AIR 280",
    rating: 5,
  },
];
