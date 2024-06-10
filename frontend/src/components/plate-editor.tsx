"use client"

import {
  Plate, usePlateStore, useEditorReadOnly, useEditorRef,
} from '@udecode/plate-common';
import { Editor } from '@/components/plate-ui/editor';
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons';
import { TooltipProvider } from "@/components/plate-ui/tooltip";
import { CommentsProvider } from '@udecode/plate-comments';
import { plugins } from "@/lib/plate-plugins"

export function PlateEditor({text, userData, children, readOnly=true, onChange=null}: any) {
  // One editor, different action buttons
  // action buttons: show/hide editor, save it's data, show it's history


  return (
    <TooltipProvider>
      <CommentsProvider users={{}} myUserId="1">
      <Plate
        plugins={plugins}
        initialValue={text}
        readOnly={readOnly}
        onChange={onChange}
      >

        {children}

        <FixedToolbar>
          <FixedToolbarButtons userData={userData}/>
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

