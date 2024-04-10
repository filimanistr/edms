"use client"

import Header from "@/components/header";
import {DataTable} from "@/components/table/data-table";
import {templatesColumns} from "@/components/table/columns";

import {getContracts, getTemplates} from "@/tokens";
import {useEffect, useState} from "react";


export default function Page() {
  const [data, setData] = useState(null)
  const page = "/templates"

  useEffect(() => {
    // На удивление выполняется лишь один раз, в начале
    getTemplates().then((data) => {
      setData(data)
    })
  }, [])

  return (
    <>
      <Header page={page} data={data} setData={setData}/>
      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        { data && <DataTable columns={templatesColumns} data={data} page={page}/> }
      </main>
    </>
  );
}

