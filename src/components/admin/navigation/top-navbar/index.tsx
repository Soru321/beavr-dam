"use client";

import { ChevronFirstIcon, ChevronLastIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/ui/other/user-nav";
import { useSideNavbar } from "@/lib/hooks/use-side-navbar";

export function TopNavbar() {
  const { isExpanded, toggleExpanded } = useSideNavbar();

  return (
    <nav className="fixed left-0 top-0 z-30 flex h-20 w-full items-center justify-between border-b bg-white px-12 shadow-lg xl:justify-end">
      <Button
        variant="secondary"
        size="icon"
        onClick={toggleExpanded}
        className="xl:hidden"
      >
        {isExpanded ? <ChevronFirstIcon /> : <ChevronLastIcon />}
      </Button>
      <UserNav />
    </nav>
  );
}
