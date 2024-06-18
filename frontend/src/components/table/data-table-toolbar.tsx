"use client"

import { Table } from "@tanstack/react-table"
import {CreateContractWindow} from "@/app/contracts/CreateContract";
import {Button} from "@/components/ui/button";
import {CreateTemplateWindow} from "@/app/templates/CreateTemplate";
import {CreateNewServiceWindow} from "@/app/services/CreateService";
import {Input} from "@/components/ui/input";
import {DataTableFacetedFilter} from "@/components/table/data-table-faceted-filter";
import {Plus} from "lucide-react";
import * as React from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  page: string
  is_admin: boolean
  data: object
}

export function DataTableToolbar<TData>({table, page, is_admin, data}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center pb-4 w-full gap-2">
      <Input
        placeholder="Поиск по названию..."
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="w-[200px] lg:w-[250px] h-8 focus-visible:ring-1 focus-visible:ring-offset-0"
      />

      {table.getColumn("status") && (
        <DataTableFacetedFilter
          column={table.getColumn("status")}
          title="Статусы"
          options={[{
            value: "согласован",
            label: "согласован",
          },
            {
              value: "ожидает согласования поставщиком",
              label: "ожидает согласования поставщиком",
            },
            {
              value: "ожидает согласования заказчиком",
              label: "ожидает согласования заказчиком",
            }]}
        />
      )}

      {/*table.getColumn("service__name") && (
        <DataTableFacetedFilter
          column={table.getColumn("template__type")}
          title="Тип"
          options={[
            {
              value: "стандартный",
              label: "стандартный",
            },
            {
              value: "собственный",
              label: "собственный",
            }
          ]}
        />
      )*/}

      {/*
        TODO: Тут надо использовать effector:
              окна делать динамик компонентами и вызывал от события стейта.
              Надо разбираться с Next.js тогда и реакт в целом
      */}

      {
        page === "/contracts" &&
          <CreateContractWindow data={data}>
              <Button className="h-8 ml-auto focus-visible:ring-1 focus-visible:ring-offset-0" variant="outline" size="sm">
                  <Plus size={18} className="mr-2 h-4 w-4"/> Новый
              </Button>
          </CreateContractWindow>
      }
      {
        (page === "/templates") &&
          <CreateTemplateWindow>
              <Button className="h-8 ml-auto focus-visible:ring-1 focus-visible:ring-offset-0" variant="outline" size="sm">
                  <Plus size={18} className="mr-2 h-4 w-4"/> Новый
              </Button>
          </CreateTemplateWindow>
      }
      {
        (page === "/services" && is_admin) &&
          <CreateNewServiceWindow>
              <Button className="h-8 ml-auto focus-visible:ring-1 focus-visible:ring-offset-0" variant="outline" size="sm">
                  <Plus size={18} className="mr-2 h-4 w-4"/> Новый
              </Button>
          </CreateNewServiceWindow>
      }
    </div>
  )
}