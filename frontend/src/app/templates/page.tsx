import Header from "@/components/header";
import {DataTable} from "@/components/table/data-table";
import {templatesColumns} from "@/components/table/columns";
import {Template} from "@/components/table/columns"

import {getTemplates} from "./api";

export default async function TemplatesPage() {
  const data: Template[] = await getTemplates();
  const page: string = "/templates";

  return (
    <>
      <Header page={page}/>

      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        { data && <DataTable columns={templatesColumns} data={data} page={page}/> }
      </main>
    </>
  );
}

