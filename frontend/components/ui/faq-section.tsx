"use client";

import { PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

function FAQ() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const faqItems = t.faq?.items || [
    {
      question: "How does the AI doubt solver work?",
      answer: "Our AI doubt solver uses advanced machine learning to understand your queries and provide step-by-step solutions. Simply type or upload your question, and get instant explanations tailored to JEE preparation."
    },
    {
      question: "Are the PYQs updated regularly?",
      answer: "Yes! We continuously update our database with the latest Previous Year Questions from JEE Main and Advanced. Our collection includes questions from the past 20 years with detailed solutions."
    },
    {
      question: "Can I access Resolve AI on mobile?",
      answer: "Absolutely! Resolve AI is fully responsive and works seamlessly on all devices. You can also connect via WhatsApp for quick doubt solving on the go."
    },
    {
      question: "What makes your AI mentor different?",
      answer: "Our AI mentor doesn't just solve problems it understands your learning patterns, identifies weak areas, and creates personalized study plans. It's like having a JEE expert available 24/7."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied with our platform, simply contact support for a full refund within the first week."
    },
    {
      question: "How do live study sessions work?",
      answer: "Live study sessions are collaborative spaces where you can join other JEE aspirants. Study together, solve problems in real-time, and stay motivated with peer support."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes! You can start with our free tier which includes basic AI doubt solving and limited PYQ access. Upgrade anytime to unlock premium features."
    },
    {
      question: "Can I switch between plans?",
      answer: "Of course! You can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate the difference."
    }
  ];

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="flex gap-10 flex-col">
            <div className="flex gap-4 flex-col">
              <div>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-mono",
                    theme === "dark" 
                      ? "border-neutral-700 text-neutral-300" 
                      : "border-neutral-300 text-neutral-700"
                  )}
                >
                  {t.faq?.badge || "FAQ"}
                </Badge>
              </div>
              <div className="flex gap-2 flex-col">
                <h4 className={cn(
                  "text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-semibold font-mono",
                  theme === "dark" ? "text-white" : "text-neutral-900"
                )}>
                  {t.faq?.title || "Got Questions? We've Got Answers"}
                </h4>
                <p className={cn(
                  "text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-left font-mono",
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                )}>
                  {t.faq?.subtitle || "Everything you need to know about Resolve AI and how it can help you ace JEE. Can't find what you're looking for? Feel free to reach out!"}
                </p>
              </div>
              <div>
                <Button 
                  className={cn(
                    "gap-4 font-mono",
                    theme === "dark"
                      ? "border-neutral-700 text-neutral-300 hover:bg-neutral-800"
                      : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                  )} 
                  variant="outline"
                >
                  {t.faq?.contactButton || "Any questions? Reach out"} <PhoneCall className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqItems.map((faq: { question: string; answer: string }, index: number) => (
              <AccordionItem 
                key={index} 
                value={"index-" + index}
                className={cn(
                  "border rounded-lg px-4",
                  theme === "dark" 
                    ? "border-neutral-800 bg-neutral-900/80" 
                    : "border-neutral-200 bg-white shadow-sm"
                )}
              >
                <AccordionTrigger 
                  className={cn(
                    "font-mono text-left hover:no-underline",
                    theme === "dark" 
                      ? "text-white hover:text-neutral-300" 
                      : "text-neutral-900 hover:text-neutral-700"
                  )}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent 
                  className={cn(
                    "font-mono",
                    theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                  )}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export { FAQ };
