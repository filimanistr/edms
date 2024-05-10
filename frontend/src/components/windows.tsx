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
import { useState, useEffect} from 'react';
import { Button } from "@/components/ui/button"
import {
  Check,
  ChevronsUpDown,
} from "lucide-react"

/* Выпадающий список с поиском */

export function SelectWithSearch({data, default_value, not_found, value, setValue}: any) {
  // TODO: Чтобы без постоянной конвертации типов надо версию 0.2.0 скачать cmdk
  const [open, setOpen] = useState(false)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? data.find((item:any) => item.id === value)?.name
              : default_value}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Выбрать контрагента" />
            <CommandEmpty>{not_found}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data.map((item:any) => (
                  <CommandItem
                    key={`${item.id}`}
                    value={`${item.id}`}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : parseInt(currentValue))
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === `${item.id}` ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
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
