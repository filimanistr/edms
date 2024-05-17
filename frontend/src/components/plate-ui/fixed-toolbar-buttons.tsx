import React from 'react';
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks';
import { useEditorReadOnly } from '@udecode/plate-common';
import { MARK_BG_COLOR, MARK_COLOR } from '@udecode/plate-font';
import { ListStyleType } from '@udecode/plate-indent-list';

import { Icons, iconVariants } from '@/components/icons';
import { AlignDropdownMenu } from '@/components/plate-ui/align-dropdown-menu';
import { ColorDropdownMenu } from '@/components/plate-ui/color-dropdown-menu';
import { IndentListToolbarButton } from '@/components/plate-ui/indent-list-toolbar-button';
import { IndentToolbarButton } from '@/components/plate-ui/indent-toolbar-button';
import { LineHeightDropdownMenu } from '@/components/plate-ui/line-height-dropdown-menu';
import { LinkToolbarButton } from '@/components/plate-ui/link-toolbar-button';
import { MoreDropdownMenu } from '@/components/plate-ui/more-dropdown-menu';
import { OutdentToolbarButton } from '@/components/plate-ui/outdent-toolbar-button';
import { TableDropdownMenu } from '@/components/plate-ui/table-dropdown-menu';
import { MarkToolbarButton } from './mark-toolbar-button';
import { ToolbarGroup } from './toolbar';

import { FontFamilyDropdownMenu } from "@/components/plate-ui/font-family/font-family-dropdown-menu"
import { FontSizeInput } from "@/components/plate-ui/font-size/font-size-input"
import { InsertDataDropdownMenu } from "@/components/plate-ui/data/insert-data-dropdown-menu";
import { InsertDropdownMenu} from "@/components/plate-ui/insert-dropdown-menu";

export function FixedToolbarButtons({userData}:any) {
  const readOnly = useEditorReadOnly();

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex flex-wrap"
        style={{
          transform: 'translateX(calc(-1px))',
        }}
      >
        {!readOnly && (
          <>
            <ToolbarGroup noSeparator>
              <InsertDataDropdownMenu userData={userData}/>
            </ToolbarGroup>

            <ToolbarGroup>
              <FontFamilyDropdownMenu/>
              <FontSizeInput/>
            </ToolbarGroup>

            <ToolbarGroup>
              <MarkToolbarButton tooltip="Выделение (⌘+B)" nodeType={MARK_BOLD}>
                <Icons.bold/>
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Курсив (⌘+I)" nodeType={MARK_ITALIC}>
                <Icons.italic />
              </MarkToolbarButton>
              <MarkToolbarButton
                tooltip="Подчеркивание (⌘+U)"
                nodeType={MARK_UNDERLINE}
              >
                <Icons.underline />
              </MarkToolbarButton>

              <MarkToolbarButton
                tooltip="Зачеркивание (⌘+⇧+M)"
                nodeType={MARK_STRIKETHROUGH}
              >
                <Icons.strikethrough />
              </MarkToolbarButton>
              <MarkToolbarButton tooltip="Код (⌘+E)" nodeType={MARK_CODE}>
                <Icons.code />
              </MarkToolbarButton>
            </ToolbarGroup>

            <ToolbarGroup>
              <ColorDropdownMenu nodeType={MARK_COLOR} tooltip="Цвет текста">
                <Icons.color className={iconVariants({ variant: 'toolbar' })} />
              </ColorDropdownMenu>
              <ColorDropdownMenu
                nodeType={MARK_BG_COLOR}
                tooltip="Цвет выделения"
              >
                <Icons.bg className={iconVariants({ variant: 'toolbar' })} />
              </ColorDropdownMenu>
            </ToolbarGroup>

            <ToolbarGroup>
              <AlignDropdownMenu />
              <LineHeightDropdownMenu />

              <IndentListToolbarButton nodeType={ListStyleType.Disc} />
              <IndentListToolbarButton nodeType={ListStyleType.Decimal} />

              <OutdentToolbarButton />
              <IndentToolbarButton />
            </ToolbarGroup>

            <ToolbarGroup>
              <LinkToolbarButton />
              <TableDropdownMenu />
              <MoreDropdownMenu />
            </ToolbarGroup>
          </>
        )}

        <div className="grow" />
      </div>
    </div>
  );
}
