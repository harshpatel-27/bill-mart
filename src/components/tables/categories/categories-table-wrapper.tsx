"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, TrashIcon } from "lucide-react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { useDataStore } from "@/stores/data.store";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { deleteCategory, deleteImage } from "@/actions";
import { CustomTable } from "..";
import { convertImgLink } from "@/lib/utils";
import Image from "next/image";

export type Category = Models.Document;

const CategoryTableWrapper = () => {
  const categories = useDataStore((state) => state.categories);
  const isHydrated = useDataStore((state) => state.hydrated);

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
      if (response.success) {
        const imageId = categories.find((cat) => cat.$id === id)?.imageId;
        if (imageId) await deleteImage(imageId);
        removeCategory(id);
        toast.success("Category deleted successfully");
      } else {
        toast.error("Failed to delete category");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete category");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "sno.",
      header: () => {
        return <Button variant="ghost">Sno.</Button>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 w-full max-w-[100px] justify-center text-center">
            <span className="w-full truncate ">{row.index + 1}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: () => {
        return <Button variant="ghost">Image</Button>;
      },
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-4 w-max max-w-[300px]">
            <span className="w-full truncate">
              <Image
                src={
                  row.original.imageId
                    ? convertImgLink(row.original.imageId)
                    : "/no-image.jpg"
                }
                height={50}
                width={50}
                className="rounded-sm"
                alt={row.original.name}
              />
            </span>
          </div>
        );
      },
    },
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
            <Button asChild size={"sm"} variant={"outline"}>
              <Link href={`/categories/edit/${row.original.$id}`}>Edit</Link>
            </Button>
            <Button
              size={"sm"}
              variant={"destructive"}
              onClick={() => handleDelete(row.original.$id)}
            >
              <TrashIcon />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <ConfirmDialog />

      <CustomTable<Category>
        data={categories}
        columns={columns}
        isLoading={!isHydrated}
        placeHolderText="Search Categories..."
      />
    </div>
  );
};

export default CategoryTableWrapper;
