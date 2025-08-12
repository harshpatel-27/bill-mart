import {
  CombineIcon,
  PackageIcon,
  ReceiptIndianRupeeIcon,
  UsersIcon,
} from "lucide-react";

export const SITE_NAME = "Bill Mart";
export const SESSION_NAME = "bill-mart-session";
export const adminNavLinks = [
  {
    name: "Products",
    url: "/",
    icon: PackageIcon,
  },
  // {
  //   name: "Invoices",
  //   url: "/invoices",
  //   icon: ReceiptIndianRupeeIcon,
  // },
  // {
  //   name: "Customers",
  //   url: "/customers",
  //   icon: UsersIcon,
  // },
  {
    name: "Categories",
    url: "/categories",
    icon: CombineIcon,
  },
];

export const fetchByRoute = {
  categories: ["products/add", "products/edit", "categories"],
  customers: ["customers", "invoices/add", "invoices/edit"],
  invoices: ["invoices"],
};


