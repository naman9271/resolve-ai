"use client";
import { DualSidebar } from "@/components/ui/sidebar-component";
import { useTheme } from "@/lib/theme-context";

export default function SidebarDemo() {
  const { theme } = useTheme();
  
  const bgMain = theme === "dark" ? "bg-black" : "bg-cream-50";
  const textPrimary = theme === "dark" ? "text-white" : "text-neutral-900";
  const textSecondary = theme === "dark" ? "text-white/70" : "text-neutral-600";
  const textMuted = theme === "dark" ? "text-white/60" : "text-neutral-500";

  return (
    <div className={`min-h-screen ${bgMain}`}>
      <DualSidebar />
      
      {/* Main content with padding for sidebar */}
      <div className="pl-[72px] p-8">
        <h1 className={`text-3xl font-bold ${textPrimary} mb-4`}>
          Sidebar Component Demo
        </h1>
        <p className={textSecondary}>
          This is a demo page showing the two-level sidebar navigation.
          The sidebar is fixed to the left and features:
        </p>
        <ul className={`mt-4 space-y-2 ${textMuted}`}>
          <li>• Icon navigation rail (left)</li>
          <li>• Detailed navigation panel (right)</li>
          <li>• Collapsible detail panel</li>
          <li>• Search functionality</li>
          <li>• Expandable menu items with dropdowns</li>
          <li>• Active route detection</li>
          <li>• User profile section</li>
        </ul>
      </div>
    </div>
  );
}
