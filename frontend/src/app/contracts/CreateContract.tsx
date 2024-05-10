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
import {SelectWithSearch} from "@/components/windows"
import {useRouter} from "next/navigation"

import {Service, Template, Counterparty, Data} from "./types"

import {createNewContract, getFields} from "./api";

export function CreateContractWindow(props: any) {
  // Отображает только те шаблоны которые соответсвуют услуге
  const { toast } = useToast()
  const [disable, setDisable] = useState(true)         // Отображение кнопки сохранения
  const [open, setOpen] = useState(false)               // Отображение формы
  const [show, setShow] = useState(false);              // Отображение строк выбора
  const [data, setData] = useState<Data>({
    counterparties: [],
    templates: [],
    services: []
  })

  // Выбранные значения
  const [name, setName] = useState("");
  const [counterparty, setCounterparty] = useState(null);
  const [template, setTemplate] = useState(null);
  const [service, setService] = useState(null);

  const router = useRouter();

  const handleClose = () => {
    if (counterparty !== null && template !== null && service !== null && name !== "") {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }

  useEffect(() => {
    handleClose();
  }, [counterparty, template, service, name]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]"
                     autoFocus={false}
                     onOpenAutoFocus={async (event) => {
                       event.preventDefault();
                       setData(await getFields())
                       setShow(true);
                     }}
                     onCloseAutoFocus={() => {
                       setCounterparty(null);
                       setTemplate(null);
                       setService(null);
                       setName("");
                     }}
      >
        <DialogHeader>
          <DialogTitle>Создать новый договор</DialogTitle>
          <DialogDescription>
            Необходимо выбрать контрагента, услугу и шаблон, соответсвующий услуге, на основе которого будет сформирован договор
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Название
            </Label>
            <Input type="text"
                   placeholder="Договор #1"
                   required
                   className=" items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
                   onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Контрагент
            </Label>
            {show && <SelectWithSearch data={data.counterparties}
                                       default_value={"Выбрать контрагента"}
                                       not_found={"Контрагент не найден"}
                                       value={counterparty}
                                       setValue={setCounterparty}
            />}

          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Услуга
            </Label>
            {show && <SelectWithSearch data={ template === null
                                              ? data.services
                                              : data.services.filter((item: Service) => item.id === data.templates.find((item2: Template) => item2.id === template)!.service)}
                                       default_value={"Выбрать услугу"}
                                       not_found={"Услуга не найдена"}
                                       value={service}
                                       setValue={setService}
            />}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Шаблоны
            </Label>
            {show && <SelectWithSearch data={ service === null ? data.templates : data.templates.filter((item: Template) => item.service === service)}
                                       default_value={"Выбрать шаблон"}
                                       not_found={"Шаблон не найден"}
                                       value={template}
                                       setValue={setTemplate}
            />}
            <div className="">
              {/* <WatchButton/> */}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={disable}
            onClick={async () => {
              await createNewContract({
                counterparty: counterparty,
                template: template,
                service: service,
                name: name
              })

              router.refresh()
              setOpen(false);
              setCounterparty(null);
              setTemplate(null);
              setService(null);
              setName("")
              toast({
                description: "Новый договор был создан успешно"
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