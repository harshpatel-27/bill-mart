"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function StockReportTable<TData, TValue>({
  columns,
  data,
}: ProductTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [currentTab, setCurrentTab] = useState("all");

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      rowSelection,
      columnFilters,
    },
  });

  useEffect(() => {
    if (currentTab == "all") {
      setColumnFilters((old) => old.filter((f) => f.id !== "type"));
      return;
    }
    setColumnFilters([
      {
        id: "type", // column id
        value: currentTab, // filter value
      },
    ]);
  }, [currentTab]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter Report..."
          value={table.getState().globalFilter ?? ""}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value || undefined);
          }}
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center justify-center mb-2">
        <Button
          onClick={() => {
            setCurrentTab("all");
          }}
          variant={"outline"}
          className={cn(
            "w-full rounded-none",
            currentTab == "all" ? "text-primary border-primary" : "",
          )}
        >
          All
        </Button>
        <Button
          onClick={() => {
            setCurrentTab("in");
          }}
          variant={"outline"}
          className={cn(
            "w-full rounded-none",
            currentTab == "in" ? "text-primary border-primary" : "",
          )}
        >
          In
        </Button>
        <Button
          onClick={() => {
            setCurrentTab("out");
          }}
          variant={"outline"}
          className={cn(
            "w-full rounded-none",
            currentTab == "out" ? "text-primary border-primary" : "",
          )}
        >
          Out
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.{" "}
                  {table.getState().globalFilter
                    ? `for ${table.getState().globalFilter}`
                    : ""}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
