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
} from "@/components/buttons"

// Запросы
import {
  getContract,
  getFields, getServices
} from "@/tokens";



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
          {new_data.status}
          <br/>
          {new_data.year}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <div className="flex w-full">
          <WatchButton/>
          <EditButton/>
          <DownloadButton/>
          <HistoryButton/>
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
          Make changes to your profile here. Click save when you're done.
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
        setDialogContent(await drawContent(props));
      }}>
        {dialogContent}
      </DialogContent>
    </Dialog>
  )
}

// TODO: Он не должен перерисовываться каждый раз
//       перерисовываться должны комманды

function SelectWithSearch({data, default_value, not_found, value, setValue}) {
  const [open, setOpen] = useState(false)

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
              ? data.find((datum) => datum.name === value)?.name
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
              {data.map((datum) => (
                <CommandItem
                  key={datum.name}
                  value={datum.name}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === datum.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {datum.name}
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

export function CreateWindow(props) {
  if (props.page === "/contracts") {
    return (
      <CreateContractWindow>
        {props.children}
      </CreateContractWindow>
    )
  } else if (props.page == "/templates") {
    return (
      <CreateTemplateWindow>
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

  // Выбранные значения
  const [counterparty, setCounterparty] = useState(null);
  const [template, setTemplate] = useState(null);
  const [service, setService] = useState(null);

  const handleClose = () => {
    if (counterparty !== null && template !== null && service !== null) {
      setDisable(false)
    } else {
      setDisable(true)
    }
  }

  useEffect(() => {
    handleClose();
  }, [counterparty, template, service]);

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
            <Label htmlFor="name" className="text-right">
              Контрагент
            </Label>
            { show && <SelectWithSearch data={data.counterparties}
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
            { show && <SelectWithSearch data={data.services}
                                        default_value={"Выбрать услугу"}
                                        not_found={"Услуга не найдена"}
                                        value={service}
                                        setValue={setService}
                                        /> }
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Шаблоны
            </Label>
            { show && <SelectWithSearch data={data.templates}
                                        default_value={"Выбрать шаблон"}
                                        not_found={"Шаблон не найден"}
                                        value={template}
                                        setValue={setTemplate}
                                        /> }
            <div className="">
              <WatchButton/>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            disabled={disable}
            onClick={() => {
              
              setOpen(false);
              setCounterparty(null)
              setTemplate(null)
              setService(null)
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
  const [template, setTemplate] = useState(null);
  const [service, setService] = useState(null);

  const handleClose = () => {
    console.log("template: ", template, "\nservice: ", service)
    if (template !== null && service !== null) {
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
              Услуга
            </Label>
            { show && <SelectWithSearch data={services}
                                        default_value={"Выбрать услугу"}
                                        not_found={"Услуга не найдена"}
                                        value={service}
                                        setValue={setService}
            /> }
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
            onClick={() => {
              setOpen(false);
              setTemplate(null)
              setService(null)
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

