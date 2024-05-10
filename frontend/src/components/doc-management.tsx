"use client"

import {useState} from "react";
import {DeleteButton, DownloadButton, EditButton, HistoryButton, WatchButton} from "@/components/buttons";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {PlateEditor} from "@/components/plate-editor";
import {PlateController} from "@udecode/plate-core";
import {useEditorRef} from "@udecode/plate-common";
import Link from "next/link";

function Toolbar({page, updateDoc, id}: any) {
  const editor = useEditorRef()

  return (
    <div className="flex w-full mb-5">
      <div className="flex gap-2">
        <DownloadButton/>
        <HistoryButton/> {/* TODO: Открывать окно истории */}
        <DeleteButton/>
      </div>

      <div className="ml-auto flex gap-2">
        <Link replace href={page}>
          <Button variant="outline" size="sm">Отмена</Button>
        </Link>

        <Link replace href={page}>
          <Button type="submit" size="sm" onClick={() => {updateDoc(id, editor.children);}}>
            Сохранить
          </Button>
        </Link>
      </div>
    </div>
  )
}

export function DocManagement({page, id, text, updateDoc}: any) {

  return (
    <PlateController>
      <Toolbar page={page} updateDoc={updateDoc} id={id}/>
      <PlateEditor text={text}/>
    </PlateController>
  )
}