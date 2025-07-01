"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Loader } from "lucide-react";
import Link from "next/link";
import { SingleProductTable } from "./single-product-table";
import { useDataStore } from "@/stores/data.store";

export type Product = {
  custom_fields: Array<{ label: string; value: string }>;
  total: number;
};

const SingleProductTableWrapper = ({ productId }: { productId: string }) => {
  const products = useDataStore((state) => state.products);
  const isHydrated = useDataStore((state) => state.hydrated);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }
  const singleProduct = products.find(({ $id }) => $id == productId);
  const newStockArr = singleProduct?.stockTransactions.map((ele) => {
    const newCustomFieldsArr = ele.custom_fields.map((elem) =>
      JSON.parse(elem),
    );
    return {
      ...ele,
      custom_fields: newCustomFieldsArr,
    };
  });

  const resultMap = new Map<string, { custom_fields: any[]; total: number }>();

  for (const txn of newStockArr) {
    const key = JSON.stringify(txn.custom_fields);
    const change = txn.type === "IN" ? txn.no_of_items : -txn.no_of_items;

    if (resultMap.has(key)) {
      resultMap.get(key)!.total += change;
    } else {
      resultMap.set(key, {
        custom_fields: txn.custom_fields,
        total: change,
      });
    }
  }

  const finalStockArr = Array.from(resultMap.values());

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {singleProduct?.name}
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
          <div className="flex items-center gap-4 w-max max-w-[300px] flex-col">
            {row.original?.custom_fields?.map((ele) => (
              <span className="w-full truncate" key={ele?.value}>
                {ele?.label}: {ele?.value}
              </span>
            ))}
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
        return (
          <div className="flex items-center gap-4 w-max max-w-[300px]">
            <span className="w-full truncate">{row.original.total}</span>
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
              <Link
                href={`/stock/add?productId=${productId}&type=in&extraLabels=${JSON.stringify(
                  row.original.custom_fields,
                )}`}
              >
                IN
              </Link>
            </Button>
            <Button asChild variant={"destructive"} size={"sm"}>
              <Link href={`/stock/add?productId=${productId}&type=out`}>
                OUT
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="text-xl font-medium">{singleProduct?.name}</div>
        {/* <Button asChild>
          <Link href="/products/add">Add Product</Link>
        </Button> */}
      </div>
      <div>
        <SingleProductTable data={finalStockArr} columns={columns} />
      </div>
    </div>
  );
};

export default SingleProductTableWrapper;
