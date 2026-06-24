import { Button } from "@/components/ui/button";
import { Check, Pencil, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-context";

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

function CreativePricing({
  tag = "Simple Pricing",
  title = "Make Short Videos That Pop",
  description = "Edit, enhance, and go viral in minutes",
  tiers,
}: {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}) {
  const { theme } = useTheme();
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="text-center space-y-6 mb-16">
        <div className={cn(
          "font-mono text-xl rotate-[-1deg]",
          theme === "dark" ? "text-blue-400" : "text-blue-600"
        )}>
          {tag}
        </div>
        <div className="relative">
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold font-mono rotate-[-1deg]",
            theme === "dark" ? "text-white" : "text-neutral-900"
          )}>
            {title}
          </h2>
          <div
            className={cn(
              "absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 rotate-[-1deg] rounded-full blur-sm",
              theme === "dark" ? "bg-blue-500/20" : "bg-blue-400/30"
            )}
          />
        </div>
        <p className={cn(
          "font-mono text-xl rotate-[-1deg]",
          theme === "dark" ? "text-neutral-400" : "text-neutral-600"
        )}>
          {description}
        </p>
      </div>

      <div className={cn(
        "grid gap-8 justify-center",
        tiers.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto" : "grid-cols-1 md:grid-cols-3"
      )}>
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group",
              "transition-all duration-300",
              tiers.length === 2 
                ? (index === 0 ? "rotate-[-1deg]" : "rotate-[1deg]")
                : (index === 0 ? "rotate-[-1deg]" : index === 1 ? "rotate-[1deg]" : "rotate-[-2deg]")
            )}
          >
            <div
              className={cn(
                "absolute inset-0",
                theme === "dark" ? "bg-neutral-900" : "bg-white",
                "border-2",
                theme === "dark" ? "border-white" : "border-neutral-900",
                "rounded-lg shadow-[4px_4px_0px_0px]",
                theme === "dark" ? "shadow-white" : "shadow-neutral-900",
                "transition-all duration-300",
                "group-hover:shadow-[8px_8px_0px_0px]",
                "group-hover:translate-x-[-4px]",
                "group-hover:translate-y-[-4px]"
              )}
            />

            <div className="relative p-6">
              {tier.popular && (
                <div
                  className={cn(
                    "absolute -top-2 -right-2 bg-amber-400 text-neutral-900",
                    "font-mono px-3 py-1 rounded-full rotate-12 text-sm border-2 border-neutral-900"
                  )}
                >
                  Popular!
                </div>
              )}

              <div className="mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full mb-4",
                    "flex items-center justify-center",
                    "border-2",
                    theme === "dark" ? "border-white" : "border-neutral-900",
                    `text-${tier.color}-500`
                  )}
                >
                  {tier.icon}
                </div>
                <h3 className={cn(
                  "font-mono text-2xl",
                  theme === "dark" ? "text-white" : "text-neutral-900"
                )}>
                  {tier.name}
                </h3>
                <p className={cn(
                  "font-mono",
                  theme === "dark" ? "text-neutral-400" : "text-neutral-600"
                )}>
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 font-mono">
                <span className={cn(
                  "text-4xl font-bold",
                  theme === "dark" ? "text-white" : "text-neutral-900"
                )}>
                  {tier.price === 0 ? "Free" : `₹${tier.price}`}
                </span>
                {tier.price > 0 && (
                  <span className={theme === "dark" ? "text-neutral-400" : "text-neutral-600"}>
                    /month
                  </span>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        theme === "dark" ? "border-white" : "border-neutral-900"
                      )}
                    >
                      <Check className="w-3 h-3" />
                    </div>
                    <span className={cn(
                      "font-mono text-lg",
                      theme === "dark" ? "text-white" : "text-neutral-900"
                    )}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                className={cn(
                  "w-full h-12 font-mono text-lg relative",
                  "border-2",
                  theme === "dark" ? "border-white" : "border-neutral-900",
                  "transition-all duration-300",
                  "shadow-[4px_4px_0px_0px]",
                  theme === "dark" ? "shadow-white" : "shadow-neutral-900",
                  "hover:shadow-[6px_6px_0px_0px]",
                  "hover:translate-x-[-2px] hover:translate-y-[-2px]",
                  tier.popular
                    ? [
                        "bg-amber-400 text-neutral-900",
                        "hover:bg-amber-300",
                        "active:bg-amber-400",
                      ]
                    : [
                        theme === "dark" ? "bg-neutral-800" : "bg-neutral-100",
                        theme === "dark" ? "text-white" : "text-neutral-900",
                        theme === "dark" ? "hover:bg-neutral-700" : "hover:bg-neutral-200",
                      ]
                )}
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { CreativePricing };
export type { PricingTier };
