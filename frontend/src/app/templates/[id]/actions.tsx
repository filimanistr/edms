"use client"

import { useState } from "react";
import {
  useEditorReadOnly, 
  useEditorRef, 
  usePlateStore
} from "@udecode/plate-common";
import {
  DeleteButton,
  HistoryButton
} from "@/components/buttons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { useRouter } from 'next/navigation'

// Actions - Кнопки взаимодействия с договором, такие как сохранить договор
//           открыть/закрыть редактор и просмотреть историю изменений

export function TemplateActions({data, update}: any) {
  const [show, setShow] = useState(false);
  const router = useRouter()

  const editor = useEditorRef()
  const setReadOnly = usePlateStore().set.readOnly();
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full mb-5">
      <div className="flex gap-2">
        <Button
          disabled={!data.editable}
          variant={readOnly ? "outline" : "default"}
          size="sm"
          onClick={() => {
            setReadOnly(!readOnly)
            setShow(true)
          }}
        >
          <PenLine size={18} className="mr-2 h-4 w-4"/> Редактор
        </Button>

        {/* <HistoryButton/> */}
        <DeleteButton disabled={!data.editable}/>
      </div>

      <div className="ml-auto flex gap-2">
        <Link replace href="/templates">
          <Button variant="outline" size="sm">Отмена</Button>
        </Link>

        <Button
          disabled={!data.editable}
          type="submit"
          size="sm"
          onClick={() => {
            update(data.id, editor.children);
            router.push("/templates")
          }}
        >
          Сохранить
        </Button>
      </div>
    </div>
  )
}
