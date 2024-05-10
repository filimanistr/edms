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
  Trash2,
  FileUp,
  FileDown
} from "lucide-react"

// UI
import {Button} from "@/components/ui/button";
import { Loader2 } from "lucide-react"


// Кнопки иконки

export function UploadButton() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <ArrowUpToLine size={18}/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Загрузить</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function DownloadButton({onclick}: any) {
  return (
    <Button variant="outline" onClick={onclick} size={"sm"}>
      <ArrowDownToLine size={18} className="mr-2 h-4 w-4"/> Скачать
    </Button>
  )
}

export function HistoryButton({onclick}: any) {
  return (
    <Button variant="outline" size="sm" onClick={onclick}>
      <History size={18} className="mr-2 h-4 w-4"/> История
    </Button>
  )
}

export function DeleteButton() {
  return (
    <Button variant="outline" size="sm">
      <Trash2 size={18} color="#d11a2a" className="mr-2 h-4 w-4"/> Удалить
    </Button>
  )
}

export function EditButton() {
  return (
    <Button variant="outline" size="sm">
      <PenLine size={18} className="mr-2 h-4 w-4"/> Редактор
    </Button>
  )
}

export function WatchButton({onclick}: any) {
  // Deprecated
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={onclick}>
            <Eye size={18}/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Просмотреть</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// С текстом

export function ButtonLoading() {
  return (
    <Button disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
  )
}

export function SendToAcceptanceButton() {
  return (
    <Button type="submit">Отправить</Button>
  )
}

export function AcceptButton() {
  return (
    <Button type="submit">Согласовать</Button>
  )
}


