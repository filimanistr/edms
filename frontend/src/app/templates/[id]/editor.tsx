"use client"

import {
  Plate, usePlateStore, useEditorReadOnly,
} from '@udecode/plate-common';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { CommentsProvider } from '@udecode/plate-comments';
import { TemplateActions } from "./actions"
import { plugins } from "@/lib/plate-plugins"

// TODO: Таблички могут убегать за края карты, не то чтобы это мешает, проблема номер 9999
// TODO: Нужны конкретные размеры текстового поля как у листа А4

export function TemplateEditor({text, data, update}: any) {
  return (
    <TooltipProvider>
      <CommentsProvider users={{}} myUserId="1">
      <Plate
        plugins={plugins}
        initialValue={text}
        // TODO: Вот конкретно после backspace последнего символа
        //       сносятся шрифты, надо как то ловить это
        onChange={(nv) => console.log(nv)}
        readOnly
      >

        { data.is_admin &&
        <TemplateActions
          data={data.data}
          update={update}
        />
        }

        <FixedToolbar>
          <FixedToolbarButtons/>
        </FixedToolbar>

        <Editor
          className="h-full rounded-md border p-4"
          focusRing={false}
          autoFocus
        />
      </Plate>
      </CommentsProvider>
    </TooltipProvider>
  )
}

