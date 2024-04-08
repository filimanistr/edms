import Header from "@/components/header";
import {DataTable} from "@/components/table/data-table";
import {templatesColumns} from "@/components/table/columns";

import {getTemplates} from "@/tokens";


export default async function Page() {
  let data = await getTemplates();

  return (
    <>
      <Header page="/templates"/>
      <main className="flex-auto min-h-screen max-w-7xl mx-auto flex-col items-center justify-between p-24">
        <DataTable columns={templatesColumns} data={data}/>
      </main>
    </>
  );
}

