"use client"

import { useState, useEffect } from 'react'

import Header from "@/components/header";
import {getContracts} from "@/tokens"

import { DataTable } from "@/components/table/data-table";
import { Contract, columns } from "@/components/table/columns"


export default function ContractsPage() {
  // TODO: хук прокидывается через все компоненты к конечному в header компоненту, где используется
  //       супер страшно, надо как то исправить, если возможно
  const [data, setData] = useState(null)
  const page = "/contracts"

  useEffect(() => {
    // На удивление выполняется лишь один раз, в начале
    getContracts().then((data) => {
        setData(data)
      })
  }, [])

  return (
    <>
      <Header page={page} data={data} setData={setData}/>

      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        { data && <DataTable columns={columns} data={data} page={page}/> }
      </main>

    </>
  );
}
