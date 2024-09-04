"use client";

import { CheckIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

import { DbCountrySelect } from "@/db/schemas/countries";
import { useDevice } from "@/lib/hooks/use-device";
import { cn } from "@/lib/utils";

import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Drawer, DrawerContent, DrawerTrigger } from "../drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

interface CountriesListProps {
  value: number;
  onChange: (value: number) => void;
  items: DbCountrySelect[];
  defaultSelectedItem?: DbCountrySelect | null;
}

export default function CountriesList({
  value,
  onChange,
  items,
  defaultSelectedItem,
}: CountriesListProps) {
  const { isMediumDevice } = useDevice();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DbCountrySelect | null>(
    defaultSelectedItem ?? null,
  );

  const triggerButton = (
    <Button
      variant="outline"
      className="w-full justify-start bg-gray-100 px-3 py-6 hover:text-foreground"
    >
      {selectedItem ? selectedItem.name : "Select Country"}
    </Button>
  );

  const list = (
    <List
      items={items}
      value={value}
      onChange={onChange}
      setOpen={setOpen}
      selectedItem={selectedItem}
      setSelectedItem={setSelectedItem}
    />
  );

  return isMediumDevice ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent align="start">{list}</PopoverContent>
    </Popover>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>{list}</DrawerContent>
    </Drawer>
  );
}

interface ListProps {
  items: DbCountrySelect[];
  value: number;
  onChange: (value: number) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedItem: DbCountrySelect | null;
  setSelectedItem: Dispatch<SetStateAction<DbCountrySelect | null>>;
}

function List({
  items,
  value,
  onChange,
  setOpen,
  selectedItem,
  setSelectedItem,
}: ListProps) {
  return (
    <Command>
      <CommandInput placeholder="Search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={`country-${item.id}`}
              value={String(item.name)}
              onSelect={(vl) => {
                onChange(item.id ?? 1);
                setSelectedItem(item);
                setOpen(false);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 size-4",
                  selectedItem?.id === item.id ? "opacity-100" : "opacity-0",
                )}
              />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
