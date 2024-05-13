import Header from "@/components/header";
import {DataTable} from "@/components/table/data-table";
import {templatesColumns} from "@/components/table/columns";
import {Template} from "@/components/table/columns"

import {getTemplates} from "./api";

export default async function TemplatesPage() {
  const data = await getTemplates();
  const page: string = "/templates";

  return (
    <>
      <Header page={page} is_admin={data.is_admin}/>

      <main className="px-24 pb-24 pt-12 flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        { data && <DataTable columns={templatesColumns} data={data.data} page={page} is_admin={data.is_admin}/> }
      </main>
    </>
  );
}

