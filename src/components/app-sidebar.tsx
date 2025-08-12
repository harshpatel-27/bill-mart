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
import { AvatarFallback, Avatar } from "./ui/avatar";
import { LogOutIcon } from "lucide-react";
import { logoutUser } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="text-xl font-bold text-center flex items-center justify-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="rounded-lg uppercase text-sm">
              {`${SITE_NAME.split(" ")[0][0]}${
                SITE_NAME?.split(" ")[1][0] ?? ""
              }`}
            </AvatarFallback>
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
