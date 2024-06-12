"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Eye,
  PenLine,
  ArrowDownToLine,
  ArrowUpToLine,
  History,
  Trash2,
} from "lucide-react"
import {Button} from "@/components/ui/button";
import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Link from "next/link";

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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Trash2 size={18} color="#d11a2a" className="mr-2 h-4 w-4"/> Удалить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверенны что хотите удалить этот договор?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя будет отменить. Информация будет утеряна безвозвратно
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <AlertDialogAction>Продолжить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function EditButton({onclick}: any) {
  return (
    <Button variant="outline" size="sm" onClick={onclick}>
      <PenLine size={18} className="mr-2 h-4 w-4"/> Редактор
    </Button>
  )
}

export function WatchButton({onclick}: any) {
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


export function AcceptButton({page, handle}: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" size="sm">
          Согласовать
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Согласовать договор?</AlertDialogTitle>
          <AlertDialogDescription>
            Внести новые изменения в договор после согласования будет не возможно
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <Link replace href={page}>
            <AlertDialogAction onClick={handle}>
              Продолжить
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function SendToAcceptanceButton({page, handle}: any) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" size="sm">
          Отправить
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Отправить догоовр на согласование?</AlertDialogTitle>
          <AlertDialogDescription>
            Догоовр будет отправлен на согласование, изменить его будет не возможно
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отменить</AlertDialogCancel>
          <Link replace href={page}>
            <AlertDialogAction onClick={handle}>
              Продолжить
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

