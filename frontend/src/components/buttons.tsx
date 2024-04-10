import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {ArrowDownToLine, ArrowUpToLine, Eye, History, PenLine, Trash2} from "lucide-react";


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

export function EditButton() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <PenLine size={18}/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Отредактировать</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function DownloadButton() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <ArrowDownToLine size={18}/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Скачать</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function HistoryButton() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <History size={18}/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>История</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

  )
}

export function WatchButton() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
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

export function DeleteButton() {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <Trash2 size={18} color="#d11a2a"/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Удалить</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
