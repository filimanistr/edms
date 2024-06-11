"use client"

import {
  useEffect,
  useState,
  useRef
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {useToast} from "@/components/ui/use-toast";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {SelectWithSearch} from "@/components/windows"
import {PlateEditor} from "@/components/plate-editor";
import {useRouter} from "next/navigation"
import { AlertCircle } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import {
  Service,
  Template,
  Counterparty,
  Data, ContractPreview
} from "./types"

import {
  createPreviewContract,
  createNewContract,
  getFields, savePreviewContract
} from "./api";
import {useEditorRef} from "@udecode/plate-common";

export function CreateContractWindow(props: any) {
  // Отображает только те шаблоны которые соответсвуют услуге
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [disable, setDisable] = useState(true)          // Отображение кнопки сохранения

  const [viewOpen, setViewOpen] = useState(false)       // Отображение окна просмотра
  const [alertOpen, setAlertOpen] = useState(false)     // Отображение alert окна
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

  const [madeChanges, setMadeChanges] = useState(false);
  const [editorValue, setEditorValue] = useState<object | null>(null);
  const [preview, setPreview] = useState<ContractPreview | null>(null);

  const router = useRouter();

  // Utils

  const nameTaken = (func: any) => {
    const nname = props.data.filter((el: any) => el.name === name);
    if (nname.length === 0) {
      func(true)
      return false
    }

    if (isAdmin) {
      if (!nname.some((el: any) => el.counterparty__id === counterparty)) {
        func(true)
        return false
      }
    }

    let title = "";
    if (isAdmin)
      title += "Договор с таким именем дял этого контрагента уже существует"
    else
      title += "Договор с таким именем уже существует"

    setAlertOpen(false)
      toast({
        variant: "destructive",
        title: title,
        description: "Измените название договора",
      })

    return true
  }

  const createWindowExitHandle = (response: any) => {
    if ('success' in response) {
      toast({
        variant: "destructive",
        title: response.title,
        description: response.description,
      })
      return
    }

    router.refresh()

    setAlertOpen(false)
    setViewOpen(false)
    setPreview(null)
    setEditorValue(null)
    setMadeChanges(false)

    setOpen(false);
    setCounterparty(null);
    setTemplate(null);
    setService(null);
    setName("")
    toast({
      description: "Новый договор был создан успешно"
    })
  }

  // Preview

  const editNewContractHandler = async () => {
    // При открытии окна предпросмотра
    if (preview !== null) {
      setViewOpen(true);
      return
    }

    if (nameTaken(setViewOpen))
      return

    const res = await createPreviewContract({
      counterparty: counterparty,
      template: template,
      service: service,
      name: name
    })

    res.user["service__name"] = res.service__name
    res.user["contract__name"] = res.name

    setPreview(res);
    setEditorValue(res.contract)
  }

  const savePreviewHandle = async () => {
    if (preview === null)
      return

    let response = await savePreviewContract({
      contract: preview.contract,
      counterparty: counterparty,
      template: template,
      service: service,
      name: name
    });

    createWindowExitHandle(response)
  }

  // Contract

  const createNewContractHandler = async () => {
    let response = await createNewContract({
      counterparty: counterparty,
      template: template,
      service: service,
      name: name
    })

    createWindowExitHandle(response);
  }

  const handleClose = () => {
    const isValid = counterparty !== null && template !== null && service !== null && name !== "";
    setDisable(!isValid);
  }

  const handleUserClose = () => {
    const isValid = template !== null && service !== null && name !== "";
    setDisable(!isValid);
  }

  useEffect(() => {
    if (service === null) {
      setTemplate(null)
    }

    if (isAdmin) {
      handleClose();
    } else {
      handleUserClose();
    }
  }, [counterparty, template, service, name, isAdmin]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {props.children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]"
                     autoFocus={false}
                     onOpenAutoFocus={async (event) => {
                       event.preventDefault();
                       const all_data = await getFields()
                       setData(all_data.data);
                       setIsAdmin(all_data.is_admin);
                       setPreview(null);
                       setEditorValue(null);
                       setMadeChanges(false);

                       setShow(true);
                     }}
                     onCloseAutoFocus={() => {
                       setPreview(null);
                       setEditorValue(null)
                       setMadeChanges(false)

                       setCounterparty(null);
                       setTemplate(null);
                       setService(null);
                       setName("");
                     }}
      >
        <DialogHeader>
          <DialogTitle>Создать новый договор</DialogTitle>
          <DialogDescription>
            Необходимо выбрать { isAdmin && "контрагента," } услугу и шаблон, соответсвующий услуге, на основе которого будет сформирован договор
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Название
            </Label>
            <Input type="text"
                   placeholder="Договор #1"
                   required
                   className=" items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-[200px] justify-between"
                   onChange={e => {
                     setName(e.target.value)
                     setPreview(null)
                     setEditorValue(null)
                     setMadeChanges(false)
                   }}
            />
          </div>

          { isAdmin &&
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Контрагент
            </Label>
            {show && <SelectWithSearch data={data.counterparties}
                                       default_value={"Выбрать контрагента"}
                                       not_found={"Контрагент не найден"}
                                       value={counterparty}
                                       setValue={setCounterparty}
                                       onChange={() => {
                                         setPreview(null)
                                         setEditorValue(null)
                                         setMadeChanges(false)
                                       }}
            />}
          </div>
          }

          <div className="grid grid-cols-3 items-center gap-4">
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
                                       onChange={() => {
                                         setPreview(null)
                                         setEditorValue(null)
                                         setMadeChanges(false)
                                       }}
            />}
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Шаблоны
            </Label>
            {show && <SelectWithSearch data={ service === null ? data.templates : data.templates.filter((item: Template) => item.service === service)}
                                       default_value={"Выбрать шаблон"}
                                       not_found={"Шаблон не найден"}
                                       value={template}
                                       setValue={setTemplate}
                                       disabled={service === null}
                                       onChange={() => {
                                         setPreview(null)
                                         setEditorValue(null)
                                         setMadeChanges(false)
                                       }}
            />}
          </div>
        </div>

        <DialogFooter>

          {/* Кнопка просмотра preview договора */}

          <Dialog open={viewOpen} onOpenChange={() => {
            if (viewOpen) setViewOpen(!viewOpen)
          }}>
            <DialogTrigger asChild>
              <Button disabled={disable}
                      variant={madeChanges ? "default" : "outline"}
                      size="sm"
                      onClick={editNewContractHandler}
              >
                Просмотреть
              </Button>
            </DialogTrigger>
            <DialogContent className={"flex flex-col max-w-[924px] h-[95%] rounded-none max-h-screen pr-0"}>
              { preview &&
                <>
                  <DialogHeader>
                    <DialogTitle>{ preview.name }</DialogTitle>
                    <DialogDescription>
                      { preview.template__name }
                    </DialogDescription>
                  </DialogHeader>

                  {/* Редактор preview договора */}

                  <ScrollArea className="absolute top-0 pr-6">
                    <PlateEditor text={preview.contract}
                                 readOnly={false}
                                 userData={preview.user}
                                 onChange={(newValue: any) => {
                                   setEditorValue(newValue)
                                 }}
                    />
                  </ScrollArea>
                </>
              }

              {/* Отменить изменения сделанные в preview договора? */}

              <DialogFooter className="pr-6 mt-auto">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Отменить
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Отменить все изменения?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Вы действительно хотите отменить все изменения сделанные в этом договоре?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Вернуться</AlertDialogCancel>
                      <AlertDialogAction onClick={() => {
                        setViewOpen(false)
                        setPreview(null)
                        setEditorValue(null)
                        setMadeChanges(false)
                      }}>
                        Продолжить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Сохранить изменения сделанные в preview договора */}

                <Button type="submit" size="sm" disabled={disable} onClick={() => {
                  if (editorValue) {
                    setPreview({...preview, contract: editorValue});
                    setViewOpen(false);
                    setMadeChanges(true);
                  }
                }}>
                  Сохранить
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Кнопка сохранения нового договора */}

          <AlertDialog open={alertOpen}>
            <AlertDialogTrigger asChild>
              <Button type="submit" size="sm" disabled={disable}
                      onClick={() => nameTaken(setAlertOpen)}
              >
                Сохранить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Создать этот договор?</AlertDialogTitle>
                <AlertDialogDescription>
                  После создания договора, ему будет передан статус ожидания согласования,
                  изменить договор уже будет неьлзя
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setAlertOpen(false)}>Вернуться</AlertDialogCancel>
                <AlertDialogAction onClick={async () => {
                  if (preview)
                    await savePreviewHandle()
                  else
                    await createNewContractHandler()
                }}>
                  Продолжить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}