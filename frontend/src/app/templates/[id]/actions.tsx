"use client"

import {useEditorReadOnly, useEditorRef, usePlateStore} from "@udecode/plate-common";
import {DeleteButton, DownloadButton, HistoryButton} from "@/components/buttons";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {PlateController} from "@udecode/plate-core";
import {PenLine} from "lucide-react";


export function TemplateActions({data, update}: any) {
  const editor = useEditorRef()
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full mb-5">
      <div className="flex gap-2">
        <Button
          variant={readOnly ? "outline" : "default"}
          size="sm"
          onClick={() => {
            setReadOnly(!readOnly)
          }}
        >
          <PenLine size={18} className="mr-2 h-4 w-4"/> Редактор
        </Button>
        <HistoryButton/> {/* TODO: Открывать окно истории */}
        {/* <DeleteButton/> */}
      </div>

      <div className="ml-auto flex gap-2">
        <Link replace href="/templates">
          <Button variant="outline" size="sm">Отмена</Button>
        </Link>

        <Link replace href="/templates">
          <Button type="submit" size="sm" onClick={() => {update(data.id, editor.children);}}>
            Сохранить
          </Button>
        </Link>
      </div>
    </div>
  )
}
