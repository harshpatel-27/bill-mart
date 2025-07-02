import React from "react";
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { InitData } from "@/components/init-data";
import { getCategories, getProducts } from "@/actions";
import { getAccount } from "@/actions/user";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme");
  const initialTheme = themeCookie?.value === "dark" ? "dark" : "light"; // Default to "light" if no cookie
  const account = await getAccount();
  let products;
  let categories;
  if (account) {
    products = await getProducts();
    categories = await getCategories();
  }

  return (
    <div className="bg-background relative">
      <InitData account={account} products={products} categories={categories} />
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full mx-auto bg-secondary p-2 flex flex-col">
          <AdminHeader initialTheme={initialTheme} />
          <div className="relative h-full w-full flex-1">
            <div className="absolute h-full w-full overflow-y-auto bg-background rounded-md p-2 sm:p-5">
              {children}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default layout;
