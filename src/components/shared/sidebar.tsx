"use client";
import { navItems } from "@/constants/data";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/utils/cn";
import { AlignJustify } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardNav from "./dashboard-nav";

type SidebarProps = {
  className?: string;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative hidden h-screen flex-none border-r z-10 pt-2 md:block bg-[#EEEDEB]`,
        status && "duration-500",
        !isMinimized ? "w-52" : "w-[72px] pt-4",
        className
      )}
    >
      <AlignJustify
        // size={20}
        strokeWidth={1.5}
        className={cn(
          "absolute -right-3 top-14 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          isMinimized && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="">
        <div className="px-3 py-2">
          <Link to="/" className="text-3xl font-bold text-[#8d181b] mb-[200px]">
            <img src="../../../logo.png" className="h-3/4" />
          </Link>
          <div className="mt-16">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}
