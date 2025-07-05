"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, TrashIcon } from "lucide-react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { useDataStore } from "@/stores/data.store";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteCustomer } from "@/actions";
import { CustomTable } from "..";

export type Customer = Models.Document;

const CustomersTableWrapper = () => {
  const isHydrated = useDataStore((state) => state.hydrated);
  const customers = useDataStore((state) => state.customers);
  const removeCustomer = useDataStore((state) => state.removeCustomer);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Customer",
    "Are you sure? This Customer will be deleted permanently.",
    "destructive",
  );

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    const loadingToast = toast.loading(
      "Please wait while deleting the customer...",
    );

    try {
      const response = await deleteCustomer(id);
      toast.dismiss(loadingToast);
      if (response.success) {
        removeCustomer(id);
        toast.success("Customer deleted successfully");
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete customer");
    }
  };
  const columns: ColumnDef<Customer>[] = [
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
      accessorKey: "phone",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Phone
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const phone = row.original.phone;
        return (
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"ghost"}
            >
              <span className="w-full truncate">{phone}</span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const email = row.original.email;
        return (
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"outline"}
            >
              <span className="w-full truncate">{email}</span>
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
            <Button asChild size={"sm"} variant={"outline"}>
              <Link href={`/customers/edit/${row.original.$id}`}>Edit</Link>
            </Button>{" "}
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
      <CustomTable<Customer>
        data={customers}
        columns={columns}
        isLoading={!isHydrated}
        placeHolderText="Search Customers..."
      />
    </div>
  );
};

export default CustomersTableWrapper;
