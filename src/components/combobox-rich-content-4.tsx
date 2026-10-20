"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { cn } from "cn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

// A searchable select whose options show an image, a label and lines of
// metadata (e.g. a client's logo, name and website). Searches the label and
// the metadata, so values can be opaque ids.

export type ComboboxRichItem<V extends string | number> = {
  value: V;
  label: string;
  /** Muted lines under the label. */
  description?: string[];
  image?: string;
};

const initials = (label: string) =>
  label
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

function ItemImage({ item, className }: { item: ComboboxRichItem<string | number>; className?: string }) {
  return (
    // Square with the image contained, so wide logos aren't cropped.
    <Avatar className={cn("size-8 rounded-md after:rounded-md", className)}>
      {item.image && (
        <AvatarImage alt="" src={item.image} className="rounded-md bg-white object-contain" />
      )}
      <AvatarFallback className="rounded-md text-xs">{initials(item.label)}</AvatarFallback>
    </Avatar>
  );
}

function ComboboxRichContent<V extends string | number>({
  id,
  items,
  value,
  onValueChange,
  placeholder = "Изберете…",
  searchPlaceholder = "Търсене…",
  emptyText = "Няма резултати.",
  invalid,
  className,
}: {
  id?: string;
  items: ComboboxRichItem<V>[];
  value: V | undefined;
  onValueChange: (value: V | undefined) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  invalid?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = items.find((item) => item.value === value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            aria-expanded={open}
            aria-invalid={invalid}
            className={cn("h-auto min-h-9 w-full justify-between py-1.5 font-normal", className)}
            role="combobox"
            variant="outline"
          />
        }
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-2">
            <ItemImage item={selected} className="size-6" />
            <span className="truncate">{selected.label}</span>
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-(--anchor-width) min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  className="flex items-start gap-2 py-3"
                  key={item.value}
                  // cmdk matches the search against value + keywords.
                  value={String(item.value)}
                  keywords={[item.label, ...(item.description ?? [])]}
                  onSelect={() => {
                    onValueChange(item.value === value ? undefined : item.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mt-1 size-4 shrink-0",
                      value === item.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <ItemImage item={item} />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="font-medium">{item.label}</div>
                    {item.description?.map((line) => (
                      <div key={line} className="truncate text-xs text-muted-foreground">
                        {line}
                      </div>
                    ))}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ComboboxRichContent };
