"use client"

/* Список с поиском */
import { cn } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState, useEffect} from 'react';

/* UI */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

// Подскажки при наведении на кнопку
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Иконки
import {
  Eye,
  PenLine,
  ArrowDownToLine,
  ArrowUpToLine,
  History,
  Check,
  ChevronsUpDown
} from "lucide-react"

// Кнопки
import {
  WatchButton,
  EditButton,
  DownloadButton,
  UploadButton,
  HistoryButton,
  DeleteButton
} from "@/components/buttons"

// Запросы
import {
  createNewContract,
  createNewTemplate,
  getContract,
  getFields,
  getServices,
  getTemplate
} from "@/tokens";

// Таблица вызывает окошко, окошко вызывает кнопки, которые вызывают окошки)
// А все потому что кнопки вызывает второстепенные окна
// окна поверх окон


async function drawContent(props: any) {
  const index = props.children.key;
  const old_data = props.data;
  const contract_index = old_data[index].id;
  const new_data = await getContract(contract_index)

  return (
    <>
      <DialogHeader>
        <DialogTitle>{new_data.name}</DialogTitle>
        <DialogDescription>
          Контрагент: {new_data.counterparty__name}
          <br/>
          Шаблон: {new_data.template__name}
          <br/>
          {new_data.status}
          <br/>
          {new_data.year}
          <br/>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div className="flex w-full">
          <WatchButton/>
          <EditButton/>
          <DownloadButton/>
          <HistoryButton/>
          {/* <DeleteButton/> */}
        </div>

        <Button type="submit">Согласовать</Button>
      </DialogFooter>
    </>
  )
}

async function drawTemplateWinContent(props: any) {
  const index = props.children.key;
  const old_data = props.data;
  const template_index = old_data[index].id;
  const new_data = await getTemplate(template_index)

  return (
    <>
      <DialogHeader>
        <DialogTitle>{new_data.name}</DialogTitle>
        <DialogDescription>
          Услуга: {new_data.service__name} <br/><br/>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div className="flex w-full">
          <WatchButton/>
          <EditButton/>
          <DownloadButton/>
          <HistoryButton/>
          {/* <DeleteButton/> */}
        </div>

        <Button type="submit">Согласовать</Button>
      </DialogFooter>
    </>
  )
}

export function AboutWindow(props: any) {
  // Отображает информацию о договоре на основе новых данных
  // Дабы обеспечить праввдивость информации
  // Старые данные находятся в data параметре
  const [dialogContent, setDialogContent] = useState(
    <>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you are done.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" autoFocus={false} onOpenAutoFocus={async (event) => {
        event.preventDefault();
        if (props.page == "/contracts") {
          setDialogContent(await drawContent(props));
        } else if (props.page == "/templates") {
          setDialogContent(await drawTemplateWinContent(props));
        }
      }}>
        {dialogContent}
      </DialogContent>
    </Dialog>
  )
}

// TODO: Он не должен перерисовываться каждый раз
//       перерисовываться должны комманды

function SelectWithSearch({data, default_value, not_found, value, setValue}) {
  // TODO: Чтобы без постоянной конвертации типов надо версию 0.2.0 скачать cmdk
  const [open, setOpen] = useState(false)

  console.log("DATA: ", data)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? data.find((item) => item.id === value)?.name
              : default_value}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Выбрать контрагента" />
            <CommandEmpty>{not_found}</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={`${item.id}`}
                    value={`${item.id}`}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : parseInt(currentValue))
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === `${item.id}` ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}

export function CreateWindow(props: any) {
  if (props.page === "/contracts") {
    return (
      <CreateContractWindow data={props.data} setData={props.setData}>
        {props.children}
      </CreateContractWindow>
    )
  } else if (props.page == "/templates") {
    return (
      <CreateTemplateWindow data={props.data} setData={props.setData}>
        {props.children}
      </CreateTemplateWindow>
    )
  }
}

export function CreateContractWindow(props: any) {
  const { toast } = useToast()
  const [disable, setDisable] = useState(true)         // Отображение кнопки сохранения
  const [open, setOpen] = useState(false)               // Отображение формы
  const [show, setShow] = useState(false);              // Отображение строк выбора
  const [data, setData] = useState({
    counterparties: [],
    templates: [],
    services: []
  })

  console.log("Рисуется окно")

  // Выбранные значения
  const [name, setName] = useState(null);
  const [counterparty, setCounterparty] = useState(null);
  const [template, setTemplate] = useState(null);
  const [service, setService] = useState(null);

  const handleClose = () => {
    if (counterparty !== null && template !== null && service !== null && name !== null) {
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
                     }}
      >
        <DialogHeader>
          <DialogTitle>Создать новый договор</DialogTitle>
          <DialogDescription>
            Необходимо выбрать контрагента, услугу и шаблон, соответсвующий услуге, на основе которого будет сформирован договор
          </DialogDescription>
        </DialogHeader>

        { /*
              TODO: Отображать только те шаблоны которые соответсвуют услуге
                    без этого создание нового договора не возможна
                    если услуга и шаблон будут отличаться
        */ }

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
            {show && <SelectWithSearch data={ template === null ? data.services : data.services.filter(item => item.id === data.templates.find(item2 => item2.id === template).service)}
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
            {show && <SelectWithSearch data={ service === null ? data.templates : data.templates.filter(item => item.service === service)}
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
              const new_row = await createNewContract({
                counterparty: counterparty,
                template: template,
                service: service,
                name: name
              })

              props.setData(oldData => [...oldData, new_row])
              setOpen(false);
              setCounterparty(null);
              setTemplate(null);
              setService(null);
              setName(null)
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

export function CreateTemplateWindow(props: any) {
  const { toast } = useToast()
  const [disable, setDisable] = useState(true)         // Отображение кнопки сохранения
  const [open, setOpen] = useState(false)               // Отображение формы
  const [show, setShow] = useState(false);              // Отображение строк выбора
  const [services, setServices] = useState()

  // Выбранные значения
  const [name, setName] = useState(null);
  const [template, setTemplate] = useState(null);
  const [service, setService] = useState(null);

  const handleClose = () => {
    if (template !== null && service !== null && name !== null) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }

  useEffect(() => {
    handleClose();
  }, [template, service]);

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
                       setTemplate(null);
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Шаблон
            </Label>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input id="file"
                     type="file"
                     accept=".doc, .docx"
                     onChange={(e) => setTemplate(e.target.files[0])}
                     className=" items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={disable}
            onClick={async () => {
              let formdata = new FormData()
              formdata.append('file', template)
              formdata.append('service', service)
              formdata.append('name', name)

              const new_row = await createNewTemplate(formdata);
              props.setData(oldData => [...oldData, new_row])

              setOpen(false);
              setTemplate(null)
              setService(null)
              setName(null)
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

export function AreYouSureWindow(props: any) {

}
