"use client"

import {useState} from 'react'
import {DropdownMenuProps} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState
} from "@/components/plate-ui/dropdown-menu";
import {ToolbarButton} from "@/components/plate-ui/toolbar";
import {
  useFontSizeDropdownMenu,
  useFontSizeDropdownMenuState
} from "@/components/plate-ui/font-size/useFontSizeDropdownMenu"

export function FontSizeInput({ children, ...props }: DropdownMenuProps) {
  const openState = useOpenState();
  const state = useFontSizeDropdownMenuState();
  const { radioGroupProps } = useFontSizeDropdownMenu(state);

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      {/* <Input /> */}
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Размер" isDropdown>
          {/* TODO: после ctrl A backspace дефолтный шрифт не добавляется в стили если его не выбрать
                    ни на что не влияет, надо как то сохранять дефолтный всегда
                    внизу заплатка */}
          {state.selectedFont ?? 14}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-0">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          {...radioGroupProps}
        >
          {state.values.map((_value) => (
            <DropdownMenuRadioItem
              key={_value}
              value={_value}
              className="min-w-[180px]"
              onClick={() => state.updateFont(_value)}
            >
              {_value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
