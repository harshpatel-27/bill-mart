"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, TrashIcon } from "lucide-react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { CategoryTable } from "./categories-table";
import { useDataStore } from "@/stores/data.store";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { deleteCategory } from "@/actions";

export type Category = Models.Document;

const CategoryTableWrapper = () => {
  const categories = useDataStore((state) => state.categories);
  const removeCategory = useDataStore((state) => state.removeCategory);
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Category",
    "Are you sure? This category will be deleted permanently.",
    "destructive",
  );

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    const loadingToast = toast.loading(
      "Please wait while deleting the category...",
    );

    try {
      const response = await deleteCategory(id);
      toast.dismiss(loadingToast);
      if (response.success) {
        removeCategory(id);
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete category");
    }
  };

  const columns: ColumnDef<Category>[] = [
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
              <Link href={`/categories/${row.original.$id}`}>Edit</Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <ConfirmDialog />
      <CategoryTable data={categories} columns={columns} />
    </div>
  );
};

export default CategoryTableWrapper;
