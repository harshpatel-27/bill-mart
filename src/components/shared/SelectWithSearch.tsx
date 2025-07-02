/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

export function SelectWithSearch({
  items,
  control,
  name,
  label,
  onSelectChange,
  placeholder,
  notFoundText = "No Data Found",
  searchText,
  bind_label,
  bind_value,
  value,
  disabled,
}: any) {
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState(value);

  if (control) {
    return (
      <>
        <FormField
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              {label ? <FormLabel>{label}</FormLabel> : <></>}
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild disabled={disabled}>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full max-w-full justify-between",
                        !field.value ? "text-muted-foreground" : "",
                      )}
                    >
                      {field.value
                        ? bind_value
                          ? items.find(
                              (item) => item[bind_value] === field.value,
                            )[bind_label]
                          : items.find((item) => item === field.value)
                        : placeholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full md:w-[300px] max-w-full p-0">
                  <Command>
                    <CommandInput placeholder={searchText} />
                    <CommandList>
                      <CommandEmpty>{notFoundText}</CommandEmpty>
                      <CommandGroup>
                        {items.map((item, i) => (
                          <CommandItem
                            value={bind_value ? item[bind_value] : item}
                            key={
                              i + "_" + (bind_value ? item[bind_value] : item)
                            }
                            onSelect={(e) => {
                              onSelectChange(e == field.value ? "" : e);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                (bind_value ? item[bind_value] : item) ===
                                  field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {bind_label ? item[bind_label] : item}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? items.find((item) => item[bind_value] === value)[bind_label]
            : { placeholder }}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchText} />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {items.map((item, i) => (
                <CommandItem
                  key={i + "_" + (bind_value ? item[bind_value] : item)}
                  value={item[bind_value] ? item[bind_value] : ""}
                  onSelect={(currentValue) => {
                    setVal(currentValue === value ? "" : currentValue);
                    onSelectChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      val === item[bind_value] ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item[bind_label] ? item[bind_label] : ""}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
