"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowLeft, ArrowUp } from "lucide-react";
import { Models } from "node-appwrite";
import { StockReportTable } from "./stock-report-table";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { deleteEmployee } from "@/actions/employees";
import { toast } from "sonner";
import { deleteStockTransaction } from "@/actions";
import Link from "next/link";

export type StockReport = Models.Document;

const StockReportTableWrapper = ({ data }: { data: Models.Document[] }) => {
  let tempTableData = data;
  const searchparams = useSearchParams();
  const productId = searchparams.get("productId");
  if (productId) {
    if (data.some(({ product }) => product.$id == productId)) {
      const newData = data.filter(({ product }) => product.$id == productId);
      tempTableData = newData;
    } else {
      tempTableData = [];
    }
  }
  const [tableData, setTableData] = useState(tempTableData);

  const handleDeleteStockRecord = (id: string) => {
    const newData = tableData.filter(({ $id }) => $id != id);
    setTableData(newData);
  };

  const keyNamesSet = new Set<string>();
  const newArr = tableData.map((ele) => {
    const customFieldsData = ele.custom_fields.map((ele) => JSON.parse(ele));
    const appendedKeyValuePair: Record<string, any> = {};

    customFieldsData.forEach((newEle) => {
      const keyName = `extraField_${newEle?.label}`;
      keyNamesSet.add(keyName);
      appendedKeyValuePair[keyName] = newEle?.value;
    });

    return {
      ...ele,
      ...appendedKeyValuePair,
    };
  });

  const uniqueKeyNames = Array.from(keyNamesSet);

  const dynamicColumns: ColumnDef<Models.Document>[] = uniqueKeyNames.map(
    (key) => ({
      accessorKey: key,

      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {key.replace("extraField_", "")}
            {column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <span
          className={cn(
            "truncate font-medium",
            row.original.type == "IN" ? "text-emerald-700" : "text-orange-800",
          )}
        >
          {row.original[key]}
        </span>
      ),
    }),
  );

  const columns: ColumnDef<StockReport>[] = [
    {
      accessorKey: "product.name",
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
            <span
              className={cn(
                "w-full truncate text-center font-medium",
                row.original.type == "IN"
                  ? "text-emerald-700"
                  : "text-orange-800",
              )}
            >
              {row.original?.product?.name}
            </span>
          </div>
        );
      },
    },
    ...dynamicColumns,
    {
      accessorKey: "no_of_items",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
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
          <div className="flex items-center gap-4 w-max max-w-[300px] justify-center text-center">
            <Button
              variant={"outline"}
              className={cn(
                "mx-auto",
                row.original.type == "IN"
                  ? "text-emerald-700"
                  : "text-orange-800",
              )}
            >
              {row.original.no_of_items}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Type
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
          <div className="flex items-center gap-4 w-max max-w-[300px] justify-center text-center">
            <Button
              variant={"outline"}
              className={cn(
                "mx-auto",
                row.original.type == "IN"
                  ? "text-emerald-700"
                  : "text-orange-800",
              )}
            >
              {row.original.type}
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "transaction_date",
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
          <div className="flex items-center gap-4 w-max max-w-[300px]">
            <span className="w-full truncate">
              {format(row.original.transaction_date, "dd/MM/yyyy")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "remarks",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Remarks
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
            <span className="w-full truncate">{row.original.remarks}</span>
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={"destructive"}>Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-md max-w-[97%]">
              <AlertDialogTitle>Delete Record</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this record?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel asChild>
                  <Button variant={"outline"}>Cancel</Button>
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    onClick={async () => {
                      const loadingToast = toast.loading(
                        "Deleting Stock Record...",
                        {
                          duration: Infinity,
                        },
                      );
                      const deletedRecord = await deleteStockTransaction(
                        row.original.$id,
                      );
                      toast.dismiss(loadingToast);
                      if (deletedRecord && deletedRecord?.success) {
                        toast.success("Record Deleted Successfully");
                        handleDeleteStockRecord(row.original.$id);
                      } else {
                        toast.error("Failed to delete record");
                      }
                    }}
                    variant={"destructive"}
                  >
                    Delete
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={"/"}
        className="text-primary flex items-center justify-start gap-1 text-xs cursor-pointer"
      >
        <ArrowLeft className="size-4" /> Back to Home
      </Link>
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">Stock Reports</div>
      </div>
      <div>
        <StockReportTable data={newArr} columns={columns} />
      </div>
    </div>
  );
};

export default StockReportTableWrapper;
