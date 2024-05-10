"use client"

import {DropdownMenuProps} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState
} from "@/components/plate-ui/dropdown-menu";
import {ToolbarButton} from "@/components/plate-ui/toolbar";
import {
  useFontFamilyDropdownMenu,
  useFontFamilyDropdownMenuState
} from "@/components/plate-ui/font-family/useFontFamilyDropdownMenu"
import { fonts } from "@/components/plate-ui/font-family/font-list"

export function FontFamilyDropdownMenu({ children, ...props }: DropdownMenuProps) {
  const openState = useOpenState();
  const state = useFontFamilyDropdownMenuState();
  const { radioGroupProps } = useFontFamilyDropdownMenu(state);

  return (
    <DropdownMenu modal={false} {...openState} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={openState.open} tooltip="Шрифт" isDropdown>
          {/* TODO: после ctrl A backspace дефолтный шрифт не добавляется в стили если его не выбрать
                    ни на что не влияет, надо как то сохранять дефолтный всегда
                    внизу заплатка */}
          {state.selectedFont ?? "Times New Roman"}
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-0">
        <DropdownMenuRadioGroup
          className="flex flex-col gap-0.5"
          {...radioGroupProps}
        >
          {fonts.map(({name, value}) => (
            <DropdownMenuRadioItem
              key={name}
              value={value}
              className="min-w-[180px]"
              onClick={() => state.updateFont(name)}
            >
              {name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
