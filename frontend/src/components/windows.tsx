"use client"

import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React, { useState, useEffect} from 'react';
import { Button } from "@/components/ui/button"
import {
  Check,
  ChevronsUpDown,
} from "lucide-react"
import {CheckIcon} from "@radix-ui/react-icons";

/* Выпадающий список с поиском */

export function SelectWithSearch({data,
                                  default_value,
                                  not_found,
                                  value,
                                  setValue,
                                  input_placeholder="Поиск",
                                  disabled=false
                                 }: any) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between col-span-2"
            disabled={disabled}
          >
            <p className="truncate">
              {value
                ? data.find(
                  (item: any) => item.id === value
                )?.name
                : default_value}
            </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
            <CommandInput placeholder="Поиск" />
            <CommandEmpty>{not_found}</CommandEmpty>
              <CommandGroup>
                {data.map((item:any) => (
                  <CommandItem
                    className="hover:bg-gray-950"
                    key={`${item.id}`}
                    value={`${item.name}`}
                    onSelect={() => {
                      if (value === item.id)
                        setValue(null)
                      else
                        setValue(item.id)
                      setOpen(false)
                    }}
                  >
                    {item.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
