"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, TrashIcon } from "lucide-react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { ProductsTable } from "./product-table";
import { useDataStore } from "@/stores/data.store";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteProduct } from "@/actions";

export type Product = Models.Document;

const ProductsTableWrapper = () => {
  const products = useDataStore((state) => state.products);
  const removeProduct = useDataStore((state) => state.removeProduct);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Product",
    "Are you sure? This Product will be deleted permanently.",
    "destructive",
  );

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    const loadingToast = toast.loading(
      "Please wait while deleting the Product...",
    );

    try {
      const response = await deleteProduct(id);
      toast.dismiss(loadingToast);
      if (response.success) {
        removeProduct(id);
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete product");
    }
  };
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
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = row.original.price;
        return (
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"ghost"}
            >
              <span className="w-full truncate">{price}/-</span>
            </Button>
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
        const stock = row.original.stock;
        return (
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"outline"}
            >
              <span className="w-full truncate">{stock}</span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "totalStockAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Amount
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const totalStockAmount = row.original.stock * row.original.price;
        return (
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"outline"}
            >
              <span className="w-full truncate">{totalStockAmount}</span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const category = row.original.category.name;
        return (
          <div className="flex items-center justify-start gap-1">
            <span className="w-full truncate">{category}</span>
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
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={() => handleDelete(row.original.$id)}
            >
              <TrashIcon />
            </Button>
            <Button asChild size={"sm"} variant={"outline"}>
              <Link href={`/products/${row.original.$id}`}>Edit</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <ConfirmDialog />
      <ProductsTable data={products} columns={columns} />
    </div>
  );
};

export default ProductsTableWrapper;
