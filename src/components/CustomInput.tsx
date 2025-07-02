"use client";
("");
import { useId } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface CustomInputProps {
  control?: any;
  className?: string;
  label?: string;
  placeholder?: string;
  inputOnly?: boolean;
  type?: string;
  errorText?: string;
  name?: string;
  isRequired?: boolean;
  isTextArea?: boolean;
  value?: string;
  onChange?: (e) => void;
  error?: { show: boolean; text: string };
  readOnly?: boolean;
  disabled?: boolean;
  inputType?: string;
  description?: string;
}
const CustomInput = ({
  control,
  className,
  label,
  placeholder,
  inputOnly,
  type = "text",
  errorText = "",
  name,
  isRequired,
  isTextArea,
  value,
  onChange,
  error,
  readOnly,
  disabled,
  inputType,
  description = "",
}: CustomInputProps) => {
  const id = useId();

  if (inputType == "calendar") {
    return (
      <FormField
        control={control!}
        name={name!}
        render={({ field }) => (
          <FormItem className="flex flex-col">
            {label && <FormLabel>{label}</FormLabel>}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "dd-MM-yyyy")
                    ) : (
                      <span>{placeholder || "Pick a date"}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : (
              <></>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <>
      {inputOnly ? (
        <div className="flex flex-col w-full gap-1.5">
          {label ? (
            <Label htmlFor={id} className="shad-form_label">
              {label}
              {isRequired ? <span className="text-rose-500"> *</span> : <></>}
            </Label>
          ) : (
            <></>
          )}
          {isTextArea ? (
            <Textarea
              id={id}
              rows={3}
              className={`shad-textarea custom-scrollbar ${className}`}
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                onChange!(e?.target?.value);
              }}
            />
          ) : (
            <Input
              className={`${className}`}
              type={type}
              id={id}
              value={value}
              name={name}
              min={1}
              onChange={(e) => {
                onChange!(e?.target?.value);
              }}
              placeholder={placeholder}
            />
          )}
          {error && error?.show ? (
            <div className="text-red-500 text-sm">{error?.text}</div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <FormField
          control={control}
          name={name!}
          render={({ field }) => (
            <FormItem className="w-full">
              {label ? (
                <FormLabel className="shad-form_label">{label}</FormLabel>
              ) : (
                <></>
              )}
              <FormControl>
                {isTextArea ? (
                  <Textarea
                    className={`shad-textarea custom-scrollbar ${className}`}
                    placeholder={placeholder}
                    rows={3}
                    {...field}
                  />
                ) : (
                  <Input
                    className={`shad-input ${className}`}
                    placeholder={placeholder}
                    type={type}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...field}
                  />
                )}
              </FormControl>
              <FormMessage className="shad-form_message">
                {errorText ? errorText : ""}
              </FormMessage>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default CustomInput;
