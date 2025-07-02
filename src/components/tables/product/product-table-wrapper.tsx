"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { ProductsTable } from "./product-table";
import { useDataStore } from "@/stores/data.store";

export type Product = Models.Document;

const ProductsTableWrapper = () => {
  const products = useDataStore((state) => state.products);

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 w-max max-w-[300px]">
            <span className="w-full truncate">{row.original.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "stock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Stock
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const totalIn = row.original.stockTransactions
          .filter((txn) => txn.type === "IN")
          .reduce((sum, txn) => sum + txn.no_of_items, 0);
        const totalOut = row.original.stockTransactions
          .filter((txn) => txn.type === "OUT")
          .reduce((sum, txn) => sum + txn.no_of_items, 0);

        const stock = totalIn - totalOut;
        return (
          <div className="flex items-center justify-start gap-1">
            <Button asChild variant={"outline"} size={"sm"}>
              <Link href={`/stock/add?productId=${row.original.$id}&type=in`}>
                IN
              </Link>
            </Button>
            <Button className="flex items-center gap-4 w-max max-w-[300px]">
              <span className="w-full truncate">{stock}</span>
            </Button>
            <Button asChild variant={"outline"} size={"sm"}>
              <Link href={`/stock/add?productId=${row.original.$id}&type=out`}>
                OUT
              </Link>
            </Button>
          </div>
        );
      },
    },

    {
      id: "actions",
      header: () => {
        return <div className="text-center">Actions</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-1">
            <Button asChild size={"sm"}>
              <Link href={`/products/${row.original.$id}`}>Stock Details</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">All Products</div>
        <Button asChild>
          <Link href="/products/add">Add Product</Link>
        </Button>
      </div>
      <div>
        <ProductsTable data={products} columns={columns} />
      </div>
      <Button
        asChild
        className="w-full max-w-lg mx-auto my-4"
        variant={"outline"}
      >
        <Link href="/stock/report">View Reports</Link>
      </Button>
    </div>
  );
};

export default ProductsTableWrapper;
