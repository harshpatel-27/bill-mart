"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, TrashIcon } from "lucide-react";
import { Models } from "node-appwrite";
import Link from "next/link";
import { useDataStore } from "@/stores/data.store";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteInvoice } from "@/actions";
import { format } from "date-fns";
import { CustomTable } from "..";

export type Invoice = Models.Document;

const InvoicesTableWrapper = () => {
  const isHydrated = useDataStore((state) => state.hydrated);
  const setInvoices = useDataStore((state) => state.setInvoices);
  const invoices = useDataStore((state) => state.invoices);
  const removeInvoice = useDataStore((state) => state.removeInvoice);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Invoice",
    "Are you sure? This invoice will be deleted permanently.",
    "destructive",
  );

  const handleDelete = async (id: string) => {
    const ok = await confirm();
    if (!ok) return;
    const loadingToast = toast.loading(
      "Please wait while deleting the invoice...",
    );

    try {
      const response = await deleteInvoice(id);
      toast.dismiss(loadingToast);
      if (response.success) {
        removeInvoice(id);
        toast.success("Invoice deleted successfully");
      } else {
        toast.error("Failed to delete invoice");
      }
    } catch (error) {
      console.log(error);
      toast.dismiss(loadingToast);
      toast.error("Failed to delete invoice");
    }
  };
  const columns: ColumnDef<Invoice>[] = [
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
      accessorKey: "$id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice No.
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
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"ghost"}
            >
              <Link
                className="w-full truncate"
                href={`/invoices/receipt/${row.original.$id}`}
              >
                {row.original?.$id}
              </Link>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "customer.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Customer name
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
          <div className="flex items-center justify-start gap-1">
            <Button
              className="flex items-center gap-4 w-max max-w-[300px]"
              variant={"ghost"}
            >
              <span className="w-full truncate">
                {row.original?.customer?.name}
              </span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "items",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Items
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
          <div className="flex items-center justify-center ">
            <Button
              className="flex items-center w-max max-w-[300px]"
              variant={"outline"}
            >
              <span className="w-full truncate">
                {row.original?.items?.length}
              </span>
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "total",
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
        return (
          <div className="flex items-center justify-start gap-1 text-center">
            <span className="w-full truncate">{row.original?.total}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Payment Method
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
          <div className="flex items-center justify-center">
            <span className="w-full truncate text-center">
              {row.original?.paymentMethod}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "$createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
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
          <div className="flex items-center justify-start gap-1">
            <span className="w-full truncate">
              {format(row.original?.$createdAt, "dd-MM-yyyy")}
            </span>
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
              <Link href={`/invoices/receipt/${row.original.$id}`}>
                View Receipt
              </Link>
            </Button>
            <Button asChild size={"sm"} variant={"outline"}>
              <Link href={`/invoices/edit/${row.original.$id}`}>Edit</Link>
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
      <CustomTable<Invoice>
        data={invoices}
        columns={columns}
        isLoading={!isHydrated}
        placeHolderText="Search Invoices..."
      />
    </div>
  );
};

export default InvoicesTableWrapper;
