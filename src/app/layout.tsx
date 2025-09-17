import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { cookies } from "next/headers";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bill Mart",
  description: "Inventory & Billing System for Small Shops",
  icons: "/logo.jpg",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("theme");
  const initialTheme = themeCookie?.value === "dark" ? "dark" : "light"; // Default to "light" if no cookie
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased ${
          initialTheme == "dark" ? "dark" : ""
        }`}
      >
        <div className=" h-full">{children}</div>
        <Toaster />
      </body>
    </html>
  );
}
