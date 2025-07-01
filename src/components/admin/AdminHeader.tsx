"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { useEffect, useState } from "react";
import { adminNavLinks } from "@/lib/constants";
import ThemeToggler from "../ThemeToggler";

interface AdminHeaderComponentProps {
  initialTheme: "light" | "dark";
}
const AdminHeader = ({ initialTheme }: AdminHeaderComponentProps) => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<
    (typeof adminNavLinks)[0] | null
  >();
  useEffect(() => {
    const data = adminNavLinks.find(({ url }) => pathname == url);
    setCurrentPage(data);
  }, [pathname]);

  return (
    <div className="h-14 bg-background flex items-center justify-between relative px-2 rounded-md mb-2 w-full">
      <SidebarTrigger className="z-[10]" />
      <div className="absolute inset-0 text-lg font-medium flex items-center justify-center truncate">
        {currentPage?.name || "Bill Mart"}
      </div>
      <ThemeToggler initialTheme={initialTheme} />
    </div>
  );
};

export default AdminHeader;
