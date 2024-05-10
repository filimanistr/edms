"use client"

import {useToast} from "@/components/ui/use-toast";
import {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SelectWithSearch} from "@/components/windows";
import {useRouter} from "next/navigation";

import {createNewTemplate} from "./api";
import {getServices} from "../services/api"

export function CreateTemplateWindow(props: any) {
  const { toast } = useToast()
  const [disable, setDisable] = useState(true)         // Отображение кнопки сохранения
  const [open, setOpen] = useState(false)               // Отображение формы
  const [show, setShow] = useState(false);              // Отображение строк выбора
  const [services, setServices] = useState()

  // Выбранные значения
  const [name, setName] = useState("");
  const [service, setService] = useState(null);

  const router = useRouter();

  const handleClose = () => {
    if (service !== null && name !== null) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }

  useEffect(() => {
    handleClose();
  }, [service, name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]"
                     autoFocus={false}
                     onOpenAutoFocus={async (event) => {
                       event.preventDefault();
                       setServices(await getServices())
                       setShow(true);
                     }}
                     onCloseAutoFocus={() => {
                       setService(null);
                     }}
      >
        <DialogHeader>
          <DialogTitle>Создать новый шаблон</DialogTitle>
          <DialogDescription>
            Необходимо выбрать услугу, для которой создается шаблон договора
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Название
            </Label>
            <Input type="text"
                   placeholder="Шаблон #1"
                   required
                   className=" items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
                   onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Услуга
            </Label>
            {show && <SelectWithSearch data={services}
                                       default_value={"Выбрать услугу"}
                                       not_found={"Услуга не найдена"}
                                       value={service}
                                       setValue={setService}
            />}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={disable}
            onClick={async () => {
              await createNewTemplate({
                service: service,
                name: name,
                template: [{"type":"p","children":[{"text":""}]}],
              })

              router.refresh()
              setOpen(false);
              setService(null)
              setName("")
              toast({
                description: "Новый шаблон был создан успешно, требует редактирования"
              })
            }}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}