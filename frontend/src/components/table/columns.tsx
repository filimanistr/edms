"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import internal from "node:stream";

// Note: Columns are where you define the core of what your table will look like.
// They define the data that will be displayed, how it will be formatted, sorted and filtered.

// This type is used to define the shape of our data.
// TODO: Переопределить куда то в ффайл отдельный
export type Contract = {
  id: number
  name: string
  counterparty__name: string
  template__name: string
  template__id: number
  status: "ожидает согласования заказчиком" | "ожидает согласование поставщиком" | "согласован"
  year: number
}

export type Service = {
  id: number
  name: string
  price: number
  year: number
}

export type Template = {
  id: number
  name: string
  service__name: string
}


export const columns: ColumnDef<Contract>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "counterparty__name",
    header: ({ column }) => {
      return (
        <Button
          className="focus-visible:ring-1 focus-visible:ring-offset-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Контрагент
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "template__name",
    header: "Шаблон",
  },
  {
    accessorKey: "status",
    header: "Статус",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "year",
    header: "Год",
  },
]



export const templatesColumns: ColumnDef<Template>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Название",
  },
  {
    accessorKey: "service__name",
    header: "Услуга",
  },
]



/* TODO: Форматированный вывод цены, добавили знак валюты, отредактировать потом */

export const servicesColumns: ColumnDef<Service>[] = [
  {
    accessorKey: "id",
    header: "#",
    cell: ({ row }) => row.index + 1
  },
  {
    accessorKey: "name",
    header: "Наименование",
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          className="focus-visible:ring-1 focus-visible:ring-offset-0 float-right"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Сумма
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("ru", {
        style: "currency",
        currency: "RUB",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "year",
    header: "Год",
  },
]
