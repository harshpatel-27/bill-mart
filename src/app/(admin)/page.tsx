"use client";
import { deleteProduct } from "@/actions";
import { CommonHeader } from "@/components/common-header";
import ProductsTableWrapper from "@/components/tables/product/product-table-wrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDataStore } from "@/stores/data.store";
import { ChevronDownIcon, Loader, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { Models } from "node-appwrite";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Page = () => {
  const [filter, setFilter] = useState("");
  const [filteredStockData, setFilteredStockData] = useState<
    Array<Models.Document>
  >([]);
  const isHydrated = useDataStore((state) => state.hydrated);
  const products = useDataStore((state) => state.products);
  const setProducts = useDataStore((state) => state.setProducts);

  const handleDeleteProduct = (id: string) => {
    const newProducts = products.filter(({ $id }) => $id !== id);
    setProducts(newProducts);
  };

  const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, ""); // removes spaces, hyphens, etc.

  useEffect(() => {
    if (!filter) return;
    const normalizedSearchTerm = normalize(filter);
    const matchedEntries = products.flatMap((p) => {
      const { individualFieldStockData, ...productMeta } = p;

      return individualFieldStockData
        .filter((entry) =>
          entry.custom_fields.some(
            (field) =>
              normalize(field?.label).includes(normalizedSearchTerm) ||
              normalize(field?.value).includes(normalizedSearchTerm),
          ),
        )
        .map((entry) => ({
          product: productMeta,
          ...entry,
        }));
    });
    setFilteredStockData(matchedEntries);
  }, [filter, products]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center flex-1 h-full">
        <Loader className="animate-spin size-5" />
      </div>
    );
  }

  return (
    <div className="pb-12">
      <CommonHeader
        title="All Products"
        btnText="Add new Product"
        href="/products/add"
      />
      <ProductsTableWrapper />

      {/* {products.length > 0 ? (
        <>
          <Separator className="max-lg:hidden my-3" />
          <div className="flex items-center py-2 sticky top-0 bg-background z-[2]">
            <Input
              placeholder="Find Stock Detail"
              value={filter}
              onChange={(event) => {
                setFilter(event.target.value);
              }}
              className="max-w-sm"
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-96 text-center flex-wrap">
          <span>No Products.</span>
        </div>
      )} */}
      {/* {filter.length > 0 ? (
        <>
          {filteredStockData.length ? (
            <div className="flex flex-col gap-2">
              {filteredStockData?.map((individualStock, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-background w-full rounded-lg p-2 px-3 border"
                >
                  <div className="w-1/2 flex flex-col gap-1">
                    <div className="text-xs leading-tight">
                      <span className="text-gray-400">Product</span> :{" "}
                      {individualStock?.product?.name}
                    </div>
                    {individualStock?.custom_fields?.length > 0 ? (
                      individualStock?.custom_fields?.map((field, i) => (
                        <div
                          key={field.value + "_" + i}
                          className="text-xs leading-tight"
                        >
                          <span className="text-gray-400">{field.label}</span> :{" "}
                          {field.value}
                        </div>
                      ))
                    ) : (
                      <div>{individualStock?.product?.name}</div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1 truncate w-1/2">
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link
                        href={`/stock/add?productId=${
                          individualStock?.product?.$id
                        }&type=in&extraLabels=${JSON.stringify(
                          individualStock.custom_fields,
                        )}`}
                      >
                        IN
                      </Link>
                    </Button>
                    <div className="min-w-8 min-h-8 flex items-center justify-center bg-secondary rounded-md border border-primary/30">
                      {individualStock.total}
                    </div>
                    <Button asChild variant={"outline"} size={"sm"}>
                      <Link
                        href={`/stock/add?productId=${
                          individualStock?.product?.$id
                        }&type=out&extraLabels=${JSON.stringify(
                          individualStock.custom_fields,
                        )}`}
                      >
                        OUT
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 text-center flex-wrap">
              <span>
                No Entry found for <span className="font-medium">{filter}</span>
              </span>
            </div>
          )}
        </>
      ) : (
        <Accordion type="single" collapsible>
          {products.map((ele) => (
            <AccordionItem key={ele.$id} value={ele.$id}>
              <AccordionTrigger className="px-2">
                {ele.name}
                <div className="flex items-center gap-2">
                  <Button asChild variant={"outline"} size={"icon"}>
                    <Link href={`/stock/add?productId=${ele.$id}&type=in`}>
                      <PlusIcon />
                    </Link>
                  </Button>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center flex-col gap-2 bg-secondary rounded-md p-1 py-2 relative">
                  {ele?.individualFieldStockData?.map((individualStock, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-background w-full rounded-lg p-2 px-3"
                    >
                      <div className="w-1/2 flex flex-col gap-1">
                        {individualStock?.custom_fields?.length > 0 ? (
                          individualStock?.custom_fields?.map((field) => (
                            <div
                              key={field.value}
                              className="text-xs leading-tight"
                            >
                              <span className="text-gray-400">
                                {field.label}
                              </span>{" "}
                              : {field.value}
                            </div>
                          ))
                        ) : (
                          <div>{ele.name}</div>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-1 truncate w-1/2">
                        <Button asChild variant={"outline"} size={"sm"}>
                          <Link
                            href={`/stock/add?productId=${
                              ele.$id
                            }&type=in&extraLabels=${JSON.stringify(
                              individualStock.custom_fields,
                            )}`}
                          >
                            IN
                          </Link>
                        </Button>
                        <div className="min-w-8 min-h-8 flex items-center justify-center bg-secondary rounded-md border border-primary/30">
                          {individualStock.total}
                        </div>
                        <Button asChild variant={"outline"} size={"sm"}>
                          <Link
                            href={`/stock/add?productId=${
                              ele.$id
                            }&type=out&extraLabels=${JSON.stringify(
                              individualStock.custom_fields,
                            )}`}
                          >
                            OUT
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center gap-2">
                    <Button size={"sm"} asChild>
                      <Link href={`stock/report?productId=${ele.$id}`}>
                        View Report
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size={"sm"}
                          className="absolute right-1"
                          variant={"destructive"}
                        >
                          <TrashIcon />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-md max-w-[97%]">
                        <AlertDialogTitle>Delete Product</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this product?
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                          <AlertDialogCancel asChild>
                            <Button variant={"outline"}>Cancel</Button>
                          </AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              onClick={async () => {
                                const loadingToast = toast.loading(
                                  "Deleting Product...",
                                  {
                                    duration: Infinity,
                                  },
                                );
                                const deletedRecord = await deleteProduct(
                                  ele.$id,
                                );
                                toast.dismiss(loadingToast);
                                if (deletedRecord && deletedRecord?.success) {
                                  toast.success("Product Deleted Successfully");
                                  handleDeleteProduct(ele.$id);
                                } else {
                                  toast.error("Failed to delete Product");
                                }
                              }}
                              variant={"destructive"}
                            >
                              Delete Product
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )} */}
    </div>
  );
};

export default Page;
