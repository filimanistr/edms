"use client"

// UI
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useState} from "react";

// Редактор
import {PlateEditor} from "@/components/plate-editor";

// Запросы
import {getTemplate} from "@/app/templates/api";
import {DownloadButton, EditButton, HistoryButton, WatchButton} from "@/components/buttons";


export function EditWindow(props: any) {
  return (
    <></>
  )
}

export function EditContractWindow(props: any) {
  return (
    <Dialog>
      <DialogTrigger>
        {props.children}
      </DialogTrigger>
      <DialogContent className="flex flex-col min-w-[648px] h-[95%] space-y-1 ">

        <DialogHeader>
          <DialogTitle>Редактор шаблона договора</DialogTitle>
          <DialogDescription>
            Здесь вы можете менять содержимое шаблона.
          </DialogDescription>
        </DialogHeader>

        {/*
        <Textarea
          className="resize-none h-full w-[600px] rounded-md border p-4 bg-white text-black focus-visible:ring-0"
        />
        */}

        <DialogFooter>
          <Button type="submit">Сохранить изменения</Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}

export function EditTemplateWindow(props: any) {
  const [template, setTemplate] = useState("");

  return (
    <Dialog>
      <DialogTrigger>
        {props.children}
      </DialogTrigger>
      <DialogContent
        className="overflow-y-scroll max-h-screen flex flex-col min-w-[1148px] h-[95%] space-y-1 "
        onOpenAutoFocus={async () => {
          setTemplate((await getTemplate(props.template_id)).template);
        }}
      >

        <DialogHeader>
          <DialogTitle>Редактор шаблона договора</DialogTitle>
          <DialogDescription>
            Здесь вы можете менять содержимое шаблона.
          </DialogDescription>
        </DialogHeader>

        <div className="flex">
          <WatchButton/>
          <EditTemplateWindow template_id={1}>
            <EditButton/>
          </EditTemplateWindow>
          <DownloadButton/>
          <HistoryButton/>
          <Button className="ml-auto" type="submit">Сохранить изменения</Button>
        </div>

        <div className="h-full space-y-1">
          <PlateEditor/>
        </div>
      </DialogContent>
    </Dialog>
  )
}
