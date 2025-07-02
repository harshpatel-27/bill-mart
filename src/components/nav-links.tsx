"use client";

import {type LucideIcon} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {usePathname} from "next/navigation";

export function NavLinks({
  links,
}: {
  links: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const pathname = usePathname();
  const {setOpenMobile} = useSidebar();

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>links</SidebarGroupLabel> */}
      <SidebarMenu>
        {links.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={pathname == item.url}
              onClick={() => setOpenMobile(false)}>
              <Link href={item.url}>
                <item.icon />
                <span className="group-data-[collapsible=icon]:hidden">
                  {item.name}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
