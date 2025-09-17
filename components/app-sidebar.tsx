"use client";

import * as React from "react";

import { NavLinks } from "@/components/nav-links";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { adminNavLinks, SITE_NAME } from "@/lib/constants";
import { AvatarFallback, Avatar, AvatarImage } from "./ui/avatar";
import { LogOutIcon } from "lucide-react";
import { logoutUser } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="text-xl font-bold text-center flex items-center justify-start gap-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/logo.png" alt="Bill Mart" />
            <AvatarFallback className="rounded-lg uppercase text-sm"></AvatarFallback>
          </Avatar>
          <span className="group-data-[collapsible=icon]:hidden truncate">
            {SITE_NAME}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks links={adminNavLinks} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logoutUser}>
              <>
                <LogOutIcon />
                <span className="group-data-[collapsible=icon]:hidden">
                  Logout
                </span>
              </>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
